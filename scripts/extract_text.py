"""Bounded text extraction. Originals are stored separately and never modified."""
import sys, json, zipfile, xml.etree.ElementTree as ET
path, kind = sys.argv[1:3]
try:
    if kind == '.txt':
        text = open(path, 'rb').read(20*1024*1024).decode('utf-8', errors='replace')
    elif kind == '.docx':
        with zipfile.ZipFile(path) as z:
            info=z.getinfo('word/document.xml')
            if info.file_size > 12*1024*1024: raise ValueError('Document text exceeds extraction limit')
            root=ET.fromstring(z.read(info))
        text='\n'.join(''.join(p.itertext()) for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'))
    elif kind == '.pdf':
        from pypdf import PdfReader
        doc=PdfReader(path)
        text='\n'.join((p.extract_text() or '') for p in doc.pages[:100])
    else:
        print(json.dumps({'text':'','status':'Original saved. Text extraction is not available for this format.'})); sys.exit(0)
    print(json.dumps({'text':text[:100000],'status':'Text extracted (up to 100 pages / 100,000 characters).' if text.strip() else 'Original saved. No extractable text; OCR may be needed.'}))
except Exception:
    print(json.dumps({'text':'','status':'Original saved. Text extraction is unavailable for this file.'}))
