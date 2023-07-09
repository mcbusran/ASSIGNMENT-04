/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Myra Busran Student ID: 127033223 Date: June 17, 2023
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const collegeData = require("C:/WEB700_OTHERS/ASSIGNMENT_4/web700-app/modules/collegeData");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route to handle root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Route to handle /students
app.get("/students", (req, res) => {
  collegeData.getAllStudents()
    .then((students) => {
      // Check for optional query parameter "course"
      const course = req.query.course;
      if (course) {
        collegeData.getStudentsByCourse(course)
          .then((studentsByCourse) => {
            res.json(studentsByCourse);
          })
          .catch(() => {
            res.status(404).json({ message: "No results returned" });
          });
      } else {
        res.json(students);
      }
    })
    .catch(() => {
      res.status(404).json({ message: "No results returned" });
    });
});

// Route to handle /tas
app.get("/tas", (req, res) => {
  collegeData.getTAs()
    .then((tas) => {
      res.json(tas);
    })
    .catch(() => {
      res.status(404).json({ message: "No results returned" });
    });
});

// Route to handle /courses
app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      res.json(courses);
    })
    .catch(() => {
      res.status(404).json({ message: "No results returned" });
    });
});

// Route to handle /student/:num
app.get("/student/:num", (req, res) => {
  const num = req.params.num;
  collegeData.getStudentByNum(num)
    .then((student) => {
      res.json(student);
    })
    .catch(() => {
      res.status(404).json({ message: "No results returned" });
    });
});

// Route to handle about page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Route to handle HTML demo page
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// Route to handle /students/add
app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// Route to handle form submission for adding a student (Step 5)
app.post("/students/add", (req, res) => {
  const studentData = req.body;
  collegeData.addStudent(studentData)
    .then(() => {
      res.redirect("/students");
    })
    .catch((error) => {
      console.error("Error adding student:", error);
      res.status(500).send("Error adding student");
    });
});

// Route to handle unmatched routes
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize collegeData and start the server
collegeData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port:", HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Error initializing collegeData:", err);
  });


