const jsPDF = window.jspdf.jsPDF;
document.getElementById('downloadPDF').addEventListener("click", function () {
  const invoice = document.querySelector('.invoice');
  console.log(invoice)
  // Set the desired font size for PDF
  const pdfFontSize = 30;
  const invoiceSection = document.querySelector('.invoice-section');

  // Get computed styles to apply the font size for PDF generation
  const computedStyles = getComputedStyle(invoiceSection);
  const originalFontSize = computedStyles.fontSize;
  console.log(screen.width)
  if (screen.width > 700) {
    invoiceSection.style.fontSize = pdfFontSize + 'px';
    invoice.style.fontSize = pdfFontSize + 'px';

  }

  html2canvas(invoice, { scale: 2 })
    .then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Set image dimensions to match PDF dimensions while maintaining aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('invoice.pdf');
      invoiceSection.style.fontSize = originalFontSize;
      invoice.style.fontSize = originalFontSize;
      // Revert back to the original font size after generating PDF
    });
});