import express, { response } from "express";
import { google } from "googleapis";
import cors from 'cors';
import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();
import { emailVerification,readData,writeData } from "./controller.js";
const app = express();
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }))

sgMail.setApiKey(process.env.SENDGRID_API)

app.post('/emailVerification', emailVerification)

app.get('/',readData )

app.post('/codeVerification', writeData)

app.listen(5000, () => console.log("server Running on 5000"))


