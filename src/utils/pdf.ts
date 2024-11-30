import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFOptions {
  filename: string;
  pageSize?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  scale?: number;
  enableLinks?: boolean;
}

const DEFAULT_OPTIONS: PDFOptions = {
  filename: 'document.pdf',
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 10,
  scale: 2,
  enableLinks: true
};

export async function generatePDF(elementId: string, options: Partial<PDFOptions> = {}): Promise<void> {
  const { filename, pageSize, orientation, margin, enableLinks } = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    // Add a class to the element during PDF generation
    element.classList.add('generating-pdf');

    // Determine if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Optimize scale and dimensions for mobile
    const scale = isMobile ? 3 : 2;
    const contentWidth = isMobile ? window.innerWidth - 40 : element.offsetWidth;

    // Create canvas with optimized settings
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: contentWidth,
      height: element.offsetHeight,
      windowWidth: contentWidth,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Optimize styling for PDF generation
          clonedElement.style.padding = isMobile ? '10px' : '20px';
          clonedElement.style.margin = '0';
          clonedElement.style.width = `${contentWidth}px`;
          clonedElement.style.border = '1px solid rgba(0, 0, 0, 0.1)';
          clonedElement.style.borderRadius = '0';
          clonedElement.style.boxShadow = 'none';
          
          // Adjust font sizes and spacing for mobile
          if (isMobile) {
            const elements = clonedElement.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i];
              const computedStyle = window.getComputedStyle(el);
              
              // Adjust font sizes
              const fontSize = parseFloat(computedStyle.fontSize);
              if (fontSize > 14) {
                el.style.fontSize = `${fontSize * 0.85}px`;
              }
              
              // Adjust margins and padding
              if (computedStyle.margin) {
                el.style.margin = `${parseFloat(computedStyle.margin) * 0.8}px`;
              }
              if (computedStyle.padding) {
                el.style.padding = `${parseFloat(computedStyle.padding) * 0.8}px`;
              }
            }
          }
        }
      }
    });

    // Initialize PDF with compression
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: pageSize,
      compress: true,
      hotfixes: ['px_scaling']
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const marginSize = isMobile ? margin / 2 : margin;

    // Calculate content dimensions
    const contentWidthPDF = pdfWidth - (2 * marginSize);
    const aspectRatio = canvas.height / canvas.width;
    const contentHeight = contentWidthPDF * aspectRatio;

    // Single page optimization for mobile
    if (isMobile && contentHeight <= (pdfHeight - 2 * marginSize)) {
      // For content that fits in one page, add it directly
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.8),
        'JPEG',
        marginSize,
        marginSize,
        contentWidthPDF,
        contentHeight,
        undefined,
        'FAST'
      );
    } else {
      // Multi-page handling with optimized compression
      let currentPosition = marginSize;
      let remainingHeight = contentHeight;
      let pageNumber = 1;

      while (remainingHeight > 0) {
        if (pageNumber > 1) {
          pdf.addPage();
        }

        const pageContentHeight = Math.min(
          pdfHeight - (2 * marginSize),
          remainingHeight
        );

        const sourceY = (currentPosition - marginSize) * (canvas.height / contentHeight);
        const sourceHeight = pageContentHeight * (canvas.height / contentHeight);

        pdf.addImage(
          canvas.toDataURL('image/jpeg', isMobile ? 0.7 : 0.9),
          'JPEG',
          marginSize,
          marginSize,
          contentWidthPDF,
          pageContentHeight,
          undefined,
          'FAST',
          0,
          sourceY,
          canvas.width,
          sourceHeight
        );

        currentPosition += pageContentHeight;
        remainingHeight -= pageContentHeight;
        pageNumber++;
      }
    }

    // Remove the temporary class
    element.classList.remove('generating-pdf');

    // Save the optimized PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}