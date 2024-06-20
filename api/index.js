const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

const Ticket = require("./models/Ticket");
;

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";

app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);

mongoose.connect(process.env.MONGO_URL);

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.get("/test", (req, res) => {
   res.json("test ok");
});

app.post('/register', async (req, res) => {
   const { name, email, password } = req.body;

   try {
       const userDoc = await UserModel.create({
           name,
           email,
           password: bcrypt.hashSync(password, bcryptSalt),
           isAdmin: false, // Assuming users are not admins by default
       });
       res.json(userDoc);
   } catch (e) {
       res.status(422).json(e);
   }
});

// User Login


app.post('/login', async (req, res) => {
   const { email, password } = req.body;

   try {
      const userDoc = await UserModel.findOne({ email });

      if (!userDoc) {
         return res.status(404).json({ error: "User not found" });
      }

      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (!passOk) {
         return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
         {
            email: userDoc.email,
            id: userDoc._id,
            isAdmin: userDoc.isAdmin // Include isAdmin in the token payload
         },
         jwtSecret,
         {}
      );

      res.cookie("token", token).json({
         name: userDoc.name,
         email: userDoc.email,
         _id: userDoc._id,
         isAdmin: userDoc.isAdmin // Include isAdmin in the response
      });

   } catch (e) {
      console.error("Error in login:", e);
      res.status(500).json({ error: "Server error" });
   }
});

// Update user profile
app.put('/profile', async (req, res) => {
   const { token } = req.cookies;
   const { name, email } = req.body;

   if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
   }

   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
         return res.status(401).json({ error: "Unauthorized" });
      }

      try {
         const updatedFields = { name, email };
         const updatedUser = await UserModel.findByIdAndUpdate(userData.id, updatedFields, { new: true });

         res.json(updatedUser);
      } catch (error) {
         console.error("Error updating user profile:", error);
         res.status(500).json({ error: "Failed to update profile" });
      }
   });
});

// Admin Registration
app.post('/adminregister', async (req, res) => {
   const { name, email, password } = req.body;

   try {
       const userDoc = await UserModel.create({
           name,
           email,
           password: bcrypt.hashSync(password, bcryptSalt),
           isAdmin: true,
       });
       res.json(userDoc);
   } catch (e) {
       res.status(422).json(e);
   }
});

// Admin Login
app.post('/adminlogin', async (req, res) => {
   const { email, password } = req.body;

   try {
       const userDoc = await UserModel.findOne({ email, isAdmin: true });

       if (!userDoc) {
           return res.status(404).json({ error: "Admin not found" });
       }

       const passOk = bcrypt.compareSync(password, userDoc.password);
       if (!passOk) {
           return res.status(401).json({ error: "Invalid password" });
       }

       jwt.sign(
           {
               email: userDoc.email,
               id: userDoc._id,
           },
           jwtSecret,
           {},
           (err, token) => {
               if (err) {
                   return res.status(500).json({ error: "Failed to generate token" });
               }
               res.cookie("token", token).json(userDoc);
           }
       );

   } catch (e) {
       res.status(500).json({ error: "Server error" });
   }
});
app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) throw err;
         try {
            const { name, email, _id, isAdmin } = await UserModel.findById(userData.id);
            if (!name || !email || !_id) {
               return res.status(404).json({ error: "User not found" });
            }
            res.json({ name, email, _id, isAdmin }); // Send isAdmin in the response
         } catch (error) {
            console.error("Error fetching user profile:", error);
            res.status(500).json({ error: "Server error" });
         }
      });
   } else {
      res.json(null);
   }
});

app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});

const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   participants: Number,
   Count: Number,
   Income: Number,
   ticketPrice: Number,
   Quantity: Number,
   revenue:Number,
   ticketsSold:Number,
   image: String,
   likes: Number,
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

app.post("/createEvent", upload.single("image"), async (req, res) => {
   try {
      const eventData = req.body;
      eventData.image = req.file ? req.file.path : "";
      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
   } catch (error) {
      res.status(500).json({ error: "Failed to save the event to MongoDB" });
   }
});

app.get("/createEvent", async (req, res) => {
   try {
      const events = await Event.find();
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
});

app.put("/events/:id", upload.single("image"), async (req, res) => {
   try {
      const eventId = req.params.id;
      const eventData = req.body;
      if (req.file) {
         eventData.image = req.file.path;
      }
      const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
      if (!updatedEvent) {
         return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(updatedEvent);
   } catch (error) {
      res.status(500).json({ error: "Failed to update the event in MongoDB" });
   }
});

// Delete Event
app.delete("/deleteEvent/:id", async (req, res) => {
   try {
      const eventId = req.params.id;
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      if (!deletedEvent) {
         return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json({ message: "Event deleted successfully" });
   } catch (error) {
      res.status(500).json({ error: "Failed to delete the event from MongoDB" });
   }
});

app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }

         event.likes += 1;
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error liking the event:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/events", (req, res) => {
   Event.find()
      .then((events) => {
         res.json(events);
      })
      .catch((error) => {
         console.error("Error fetching events:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/eventsByOwner/:owner", async (req, res) => {
   try {
      const owner = req.params.owner;
      const events = await Event.find({ owner });
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events by owner from MongoDB" });
   }
});



app.get("/event-stats", async (req, res) => {
  try {
    const events = await Event.find({}, { title: 1, participants: 1, revenue: 1, ticketsSold: 1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});
app.post("/tickets", async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new Ticket(ticketDetails);
      await newTicket.save();
      
      // // Update event statistics
      await updateEventStatistics(newTicket.eventid);

      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});



const updateEventStatistics = async (eventid) => {
  try {
    // Fetch the event
    const event = await Event.findById(eventid);
    if (!event) {
      throw new Error('Event not found');
    }

    // Fetch all tickets for the event
    const tickets = await Ticket.find({ eventid });

    // Calculate participants, ticketsSold, and revenue
    const participants = tickets.length;
    const Count = tickets.length;
    const ticketPrice = event.ticketPrice; // Assuming ticketPrice is stored in the event
    const ticketsSold = Count; // Number of tickets sold is the same as the count
    const revenue = Count * ticketPrice;

    // Update event statistics
    event.participants = participants;
    event.ticketsSold = ticketsSold;
    event.revenue = revenue;

    await event.save();
  } catch (error) {
    console.error('Error updating event statistics:', error);
    throw new Error('Failed to update event statistics');
  }
};


app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await Ticket.find();
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});

app.get("/tickets/user/:userId", (req, res) => {
   const userId = req.params.userId;

   Ticket.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await Ticket.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});

// Add new endpoints for editing and deleting events
app.put("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedEvent) {
         return res.status(404).json({ message: "Event not found" });
      }
      res.json(updatedEvent);
   } catch (error) {
      res.status(500).json({ error: "Failed to update event in MongoDB" });
   }
});

app.delete("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
         return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
   } catch (error) {
      res.status(500).json({ error: "Failed to delete event from MongoDB" });
   }
});
app.get("/events", async (req, res) => {
   const { owner } = req.query;
   try {
     const query = owner ? { owner } : {};
     const events = await Event.find(query);
     res.status(200).json(events);
   } catch (error) {
     res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
 });
 app.get('/users', async (req, res) => {
   try {
     const nonAdminUsers = await UserModel.find({ isAdmin: false });
     res.json(nonAdminUsers);
   } catch (error) {
     console.error("Error fetching non-admin users:", error);
     res.status(500).json({ message: "Server error" });
   }
 });
 
 // Import your Event model

 app.get("/events-fullstats", async (req, res) => {
   try {
     // Fetch all events
     const events = await Event.find({}, { title: 1, participants: 1, revenue: 1, ticketsSold: 1 });
     
     // Calculate total revenue, total participants, and total tickets sold
     const totalRevenue = events.reduce((total, event) => total + event.revenue, 0);
     const totalParticipants = events.reduce((total, event) => total + event.participants, 0);
     const totalTicketsSold = events.reduce((total, event) => total + event.ticketsSold, 0);
 
     // Prepare response object
     const response = {
       totalRevenue: totalRevenue,
       totalParticipants: totalParticipants,
       totalTicketsSold: totalTicketsSold,
       events: events
     };
     
     res.json(response);
   } catch (error) {
     console.error("Error fetching events:", error);
     res.status(500).json({ message: "Server error" });
   }
 });
 

 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
