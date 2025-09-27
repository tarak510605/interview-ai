import * as pdfjsLib from 'pdfjs-dist/webpack';
import mammoth from 'mammoth';

export interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  content: string;
}

export async function parseResume(file: File): Promise<ParsedResumeData> {
  let content = '';
  
  if (file.type === 'application/pdf') {
    content = await parsePDF(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    content = await parseDocx(file);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }

  return extractContactInfo(content);
}

async function parsePDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
    }

    return fullText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted.');
  }
}

async function parseDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Please ensure the file is not corrupted.');
  }
}

function extractContactInfo(content: string): ParsedResumeData {
  const text = content.toLowerCase();
  
  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = content.match(emailRegex);
  const email = emailMatches ? emailMatches[0] : '';

  // Extract phone number
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatches = content.match(phoneRegex);
  const phone = phoneMatches ? phoneMatches[0] : '';

  // Extract name (this is more complex and might need improvement)
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  let name = '';
  
  // Try to find name in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Skip if line contains common resume headers or is too long
    if (line.length > 50 || 
        /resume|curriculum|cv|objective|summary|experience|education|skills/i.test(line) ||
        emailRegex.test(line) || 
        phoneRegex.test(line)) {
      continue;
    }
    
    // Check if it looks like a name (2-4 words, each starting with capital letter)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && 
        words.every(word => /^[A-Z][a-z]+$/.test(word))) {
      name = line;
      break;
    }
  }

  return {
    name,
    email,
    phone,
    content,
  };
}