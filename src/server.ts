import express, { Application } from "express"; 
import dotenv from "dotenv";
import cors from 'cors';
dotenv.config();

import { AppDataSource } from "./database/db";
import {
  getProfile,
  getUsers,
  updateUserById,
  deleteUsers
} from "./controllers/userController";
import { auth } from "./database/middlewares/auth";

import { isSuperAdmin } from "./database/middlewares/isSuperAdmin";
import { getServices } from "./controllers/serviceController";
import {
  createAppointment,
  getAppointmentById,
  getMyAppointments,
  updateAppointmentById,
  deleteAppointments
} from "./controllers/appointmentController";

import { login, register } from "./controllers/authController";


 
const app: Application = express(); //ejecutar funcion y guardar en una variable.
app.use(cors())
app.use(express.json()); //para darle formato json

const PORT = process.env.PORT || 4000;

app.get("/api/healthy", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});



//AUTH routes -endpoint.
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

// User routes -endpoint.
app.get("/api/users", auth, isSuperAdmin, getUsers);
app.get("/api/users/profile", auth, getProfile);
app.put("/api/users/profile", auth, updateUserById);
app.delete("/api/users/:id", auth, isSuperAdmin, deleteUsers);

//Services routes -endpoint.

app.get("/api/services", getServices);

//Appointments routes -endpoint.
app.post("/api/appointments", auth, createAppointment); //para crear la cita
app.get("/api/myappointments/:id", auth, getAppointmentById); //ver mi cita
app.put("/api/appointments/:id", auth, updateAppointmentById); //modificar/actualizar cita
app.get("/api/myappointments/", auth, getMyAppointments);
app.delete("/api/appointments/:id", auth, deleteAppointments)


//Estructura básica para el servidor
const startServer = () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected");

      app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

startServer();
