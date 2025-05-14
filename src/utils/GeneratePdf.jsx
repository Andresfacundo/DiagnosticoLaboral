import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GeneratePDF = async (elementId,fileName) => {
    const input = document.getElementById(elementId);
    if (!input) return;
 
    input.classList.add('pdf-colors');
    
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true,
        backgroundColor: null,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
      });
      const imgData = canvas.toDataURL('image/png');   
      const orientation  = window.innerWidth > window.innerHeight ? 'l' : 'p';   
      const pdf = new jsPDF(orientation, 'mm', [210, canvas.height * 210 / canvas.width]); // Ajusta el tamaño del PDF
      // Ajustar tamaño de imagen al PDF
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generando el PDF:', error);
    } finally {
      input.classList.remove('pdf-colors');

    }
  };
export default GeneratePDF;