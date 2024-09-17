import cron from 'node-cron';
import { EmailService } from '../services/email.service';
import { generateCaseEmailTemplate } from '../templates/email.template';
import { CaseModel } from '../../data/models/case.model';

export const emailJob = () => {
    const emailService = new EmailService();

    cron.schedule("*/10 * * * * *", async ()=>{
        try {
            const cases = await CaseModel.find({ isSent: false });
            
            if (!cases.length){
                console.log("No hay casos por enviar");
                return;
            }

            console.log(`Procesando ${cases.length} Casos`)
            await Promise.all(
                cases.map(async (caso)=>{
                    try {
                        const htmlBody = generateCaseEmailTemplate(caso.lat, caso.lng, caso.genre, caso.age)
                        await emailService.sendEmail({
                            to: "oziel.comics@gmail.com",
                            subject: "Caso de Viruela del Mono",
                            htmlBody: htmlBody
                        });
                        console.log(`Email enviado para el case con ID: ${caso._id}`)
    
                        let updateCase = {
                            lat: caso.lat,
                            lng: caso.lng,
                            isSent: true,
                            genre: caso.genre,
                            age: caso.age
                        };
    
                        await CaseModel.findByIdAndUpdate(caso._id, updateCase);
                        console.log(`Case actualizado para el ID: ${caso._id}`)
                    } catch (error) {
                        console.error("Error al procesar el case")
                    }
                })
            );

        } catch (error) {
            console.error("Error durante el envio de correo")
        }
    });
}