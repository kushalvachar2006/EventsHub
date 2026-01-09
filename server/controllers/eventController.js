const Event = require("../models/eventModel");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all events (with optional filtering)
// @route   GET /api/events
const getAllEvents = async (req, res) => {
  try {
    const { college, search } = req.query;
    let query = {};

    // Filter by college if provided
    if (college) {
      query.college = college;
    }

    // Search by text (title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query).populate("host", "name email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("host", "name");
    if (event) {
      return res.status(200).json(event);
    }
    return res.status(404).json({ message: "Event not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create event (Host only)
// @route   POST /api/events
const createEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    category,
    registrationDeadline,
    teamSize,
    minTeamSize,
    requireTeamDetails,
    prizePool,
    prizeCurrency,
    organizerName,
    contactEmail,
    organizerWebsite,
    website,
  } = req.body;

  try {
    let bannerUrl = "";

    // If an image was uploaded in memory, push to Cloudinary
    if (req.file && req.file.buffer) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "events-hub/banners" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await uploadFromBuffer();
      bannerUrl = result.secure_url || result.url || "";
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      bannerUrl,
      registrationDeadline,
      teamSize,
      minTeamSize: minTeamSize || 1,
      requireTeamDetails:
        requireTeamDetails === "true" || requireTeamDetails === true,
      college: req.user.college, // Event belongs to host's college
      host: req.user.id,
      // optional fields provided by host
      prizePool:
        prizePool !== undefined && prizePool !== null && prizePool !== ""
          ? Number(prizePool)
          : undefined,
      prizeCurrency: prizeCurrency || undefined,
      organizerName: organizerName || undefined,
      contactEmail: contactEmail || undefined,
      organizerWebsite: organizerWebsite || website || undefined,
      website: website || organizerWebsite || undefined,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event (Host only)
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ensure user is the host of this event
    if (event.host.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event (Host only)
// @route   PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ensure user is the host of this event
    if (event.host.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this event" });
    }

    // Build update fields
    const {
      title,
      description,
      date,
      location,
      category,
      registrationDeadline,
      teamSize,
      minTeamSize,
      requireTeamDetails,
      prizePool,
      prizeCurrency,
      organizerName,
      contactEmail,
      organizerWebsite,
      website,
    } = req.body;
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (category !== undefined) event.category = category;
    if (registrationDeadline !== undefined)
      event.registrationDeadline = registrationDeadline;
    if (teamSize !== undefined) event.teamSize = teamSize;
    if (minTeamSize !== undefined) event.minTeamSize = minTeamSize;
    if (requireTeamDetails !== undefined)
      event.requireTeamDetails =
        requireTeamDetails === "true" || requireTeamDetails === true;

    // Optional host-provided fields
    if (prizePool !== undefined) event.prizePool = Number(prizePool);
    if (prizeCurrency !== undefined) event.prizeCurrency = prizeCurrency;
    if (organizerName !== undefined) event.organizerName = organizerName;
    if (contactEmail !== undefined) event.contactEmail = contactEmail;
    if (organizerWebsite !== undefined)
      event.organizerWebsite = organizerWebsite;
    if (website !== undefined) event.website = website;

    // Update banner if a new file is uploaded
    if (req.file && req.file.buffer) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "events-hub/banners" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      const result = await uploadFromBuffer();
      event.bannerUrl = result.secure_url || result.url || "";
    }

    const updated = await event.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
};
