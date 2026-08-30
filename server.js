const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS allows frontend → backend communication
app.use(cors());

// Allow JSON requests
app.use(express.json());

// Multer will temporarily keep uploaded files in memory
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/tiff",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, JPEG, TIFF and GeoTIFF files are allowed"));
    }
  },
});

// Home test route
app.get("/", (req, res) => {
  res.json({
    message: "SatQuery AI Backend is running 🌍",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SatQuery Backend",
  });
});

// Main SatQuery analysis endpoint
app.post(
  "/api/analyze",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const question = req.body.question;
      const mode = req.body.mode;

      const image1 = req.files?.image1?.[0];
      const image2 = req.files?.image2?.[0];

      // Basic validation
      if (!question) {
        return res.status(400).json({
          success: false,
          error: "Question is required",
        });
      }

      if (!mode) {
        return res.status(400).json({
          success: false,
          error: "Analysis mode is required",
        });
      }

      if (!image1) {
        return res.status(400).json({
          success: false,
          error: "At least one image is required",
        });
      }

      // Temporary demo response
      // Later this is where we will call your friend's FastAPI AI.
      res.json({
        success: true,

        message: "SatQuery request received successfully",

        received: {
          mode,
          question,

          image1: {
            filename: image1.originalname,
            type: image1.mimetype,
            size: image1.size,
          },

          image2: image2
            ? {
                filename: image2.originalname,
                type: image2.mimetype,
                size: image2.size,
              }
            : null,
        },

        nextStep:
          "This request will later be forwarded to the Python FastAPI AI service.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`SatQuery Backend running on port ${PORT}`);
});