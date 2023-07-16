import { google } from "googleapis";
import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv';
dotenv.config();
let num;
let emailAddress;

export const emailVerification = async (req, res, next) => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const email = req.body.email;
    emailAddress=email;
    const message = {
        from: process.env.sender_email, // sender address
        to: `${email}`, // list of receivers
        subject: "Verification Code: Verify your Email", // Subject line
        text: `<h1>Here is the Verification Code</h2>: `, // plain text body
        html: `<h2>${randomNumber}</h2>`, // html body    
    }
    sgMail.send(message).then(response => {
        console.log("Email Sent")
        num = randomNumber;
        console.log(num);
        return res.status(200).json({ "Message": 'Success!' })
    })
        .catch(error => {
            console.log(error)
            return response.status(500).json({ "Error": error });
        })
}

export const readData = async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",//containing credentials from console.google.com
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    //create client instance for auth
    const client = await auth.getClient();
    //instance of google sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client })

    const spreadsheetId = process.env.spreadsheetId;
    //get Metadata from sheets
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,

    })
    //read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"//Sheet1!A:C  Meaning Col-A to Col-C
    })
    res.send(getRows.data)
}

export const writeData = async (req, res) => {
    
    const { code ,email } = req.body;
    console.log("Code:", num, code);
    console.log("Email", emailAddress, email);
    if(code!=num){
        console.log("Invalid Code");
        return res.status(503).send("Invalid Code");
    }
    console.log(req.body);

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    //create client instance for auth
    const client = await auth.getClient();
    //instance of google sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client })
    //SpreadSheet ID
    const spreadsheetId = process.env.spreadsheetId;

    //read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"//Sheet1!A:C  Meaning Col-A to Col-C
    })

    //write rows to the sheet
    googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1",
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [email]
            ]
        }
    })
    console.log('Post Called')
    res.status(200).send("Success")
}