const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,
    systemInstruction:'I need you to generate an optimized and simple solution, efficient, easy to read, and well-structured. I expect the code to follow best practices, including error handling and resource management. With over 8 years of experience as a full-stack web developer, I value scalable and secure web application development, so make sure the solution reflects that expertise.'
});

const generateResult=async(prompt)=>{
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
}

module.exports={generateResult}

