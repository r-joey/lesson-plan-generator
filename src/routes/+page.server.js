
import { fail } from '@sveltejs/kit';
import { lessonPlannerSchema, model } from '$lib/utils';
export const config = {
    runtime: 'edge'
}
export const actions = { 
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());  
        try {
           lessonPlannerSchema.parse(formData);  
        } catch (err) {
            const { fieldErrors: errors} = err.flatten();
            return fail(400, { data: formData, errors });
        } 
        const prompt = `
            Generate a lesson plan following the ${formData.format} model for a ${formData.gradeLevel} class at the ${formData.subject} level.

            Ensure that the lesson plan includes the following:

            Learning Objectives: Clearly state the goals for student learning.
            Materials and Resources: Provide a list of tools, materials, or online resources needed for the lesson.
            Instructional Procedures: Detailed steps for each stage of the lesson, ensuring alignment with the chosen format (e.g., Engage, Explore, Explain, Elaborate, Evaluate for 5Es).
            Assessment: Describe how student understanding will be evaluated (both formative and summative if needed).
            Differentiation: Offer strategies for accommodating diverse learning needs or abilities.

            At the end of the lesson the students should be able to ${formData.objectives}.
        `

        try { 
            const genAiResult = await model.generateContent(prompt);
            const genAiResultText = genAiResult.response.text();
            return {
                success: true,
                genAiResult: genAiResultText
            }
        } catch (err) {
            console.log(err)
            return fail(500, { data: formData, errors: err });
        }
        
    }
};