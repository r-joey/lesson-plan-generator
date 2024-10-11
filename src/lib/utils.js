import { z } from 'zod';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from '$env/static/private'; 

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);


export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const lessonPlannerSchema = z.object({
    format: z.enum(['4As', '5Es', '7Es', 'MATATAG'], { errorMap: () => ({ message: 'Please select a valid lesson format.' }) }),
    subject: z.string().min(2, 'Subject must be at least 2 characters long').max(50, 'Subject must be at most 50 characters long').trim(),
    gradeLevel: z.enum([  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12' ], {  errorMap: () => ({ message: 'Please select a valid grade level' } ) }),
    objectives: z.string().min(5, 'Objectives must be at least 5 character long').max(500, 'Objectives must be at most 500 characters long').trim(),
  });
  