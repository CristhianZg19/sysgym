import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function generarPDF(pago) {
  const docDefinition = {
    pageSize: { width: 240, height: 340 },
  pageOrientation: 'landscape',
    content: [
      {
        text: 'Nombre de la Empresa',
        alignment: 'center',
        bold: true,
        fontSize: 10,
        margin: [0, 2, 0, 5]
      },
      {
        text: 'RUC: 123456789',
        alignment: 'center',
        fontSize: 8,
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Direccion de la Empresa',
        alignment: 'center',
        fontSize: 8,
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Web de la Empresa',
        alignment: 'center',
        fontSize: 8,
        margin: [0, 0, 0, 5]
      },
      { text: 'Comprobante de pago', style: 'header' },
      { text: `Nombre: ${pago.nombre}`, style: 'subheader' },
      { text: `Fecha: ${pago.fecha}`, style: 'subheader' },
      { text: `Monto: ${pago.monto}`, style: 'subheader' },
      {
        text: 'Gracias por su compra!',
        alignment: 'center',
        margin: [0, 10, 0, 0]
      },
      {
        text: 'www.empresa.com',
        alignment: 'center',
        fontSize: 8,
        margin: [0, 0, 0, 5]
      }
    ],
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      subheader: {
        fontSize: 10,
        bold: true,
        margin: [0, 5, 0, 5]
      }
    }
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.open();
}

export default generarPDF;
