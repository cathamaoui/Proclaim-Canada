const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Preacher data matching seed-full-10.js
const preachers = [
  {
    name: 'Pastor John Smith',
    denomination: 'Baptist',
    experience: 25,
    phoneNumber: '(647) 555-0101',
    city: 'Toronto',
    professions: ['Sermon Delivery', 'Youth Ministry', 'Biblical Counseling'],
    education: [
      { school: 'Toronto Baptist Seminary', degree: 'Master of Divinity', year: 2002 },
      { school: 'University of Toronto', degree: 'Bachelor of Arts in Religious Studies', year: 1998 }
    ]
  },
  {
    name: 'Rev. Sarah Johnson',
    denomination: 'Methodist',
    experience: 18,
    phoneNumber: '(604) 555-0102',
    city: 'Vancouver',
    professions: ['Sermon Delivery', 'Spiritual Direction', 'Worship Leadership'],
    education: [
      { school: 'Vancouver School of Theology', degree: 'Master of Divinity', year: 2008 },
      { school: 'Simon Fraser University', degree: 'Bachelor of Arts in Philosophy', year: 2005 }
    ]
  },
  {
    name: 'Pastor Michael Chen',
    denomination: 'Pentecostal',
    experience: 22,
    phoneNumber: '(403) 555-0103',
    city: 'Calgary',
    professions: ['Sermon Delivery', 'Apostolic Ministry', 'Prayer Leadership'],
    education: [
      { school: 'Foursquare International University', degree: 'Certificate in Ministry', year: 2004 },
      { school: 'University of Calgary', degree: 'Bachelor of Commerce', year: 2001 }
    ]
  },
  {
    name: 'Rev. Patricia Williams',
    denomination: 'Presbyterian',
    experience: 20,
    phoneNumber: '(514) 555-0104',
    city: 'Montreal',
    professions: ['Sermon Delivery', 'Pastoral Care', 'Congregational Development'],
    education: [
      { school: 'Presbyterian College', degree: 'Master of Divinity', year: 2006 },
      { school: 'McGill University', degree: 'Bachelor of Arts in Theology', year: 2003 }
    ]
  },
  {
    name: 'Pastor David Rodriguez',
    denomination: 'Baptist',
    experience: 15,
    phoneNumber: '(204) 555-0105',
    city: 'Winnipeg',
    professions: ['Sermon Delivery', 'Community Outreach', 'Small Group Leadership'],
    education: [
      { school: 'Canadian Baptist Seminary', degree: 'Master of Divinity', year: 2011 },
      { school: 'University of Manitoba', degree: 'Bachelor of Arts in Communications', year: 2008 }
    ]
  },
  {
    name: 'Rev. Emily Thompson',
    denomination: 'Anglican',
    experience: 28,
    phoneNumber: '(613) 555-0106',
    city: 'Ottawa',
    professions: ['Sermon Delivery', 'Liturgical Worship', 'Sacramental Ministry'],
    education: [
      { school: 'Wycliffe College', degree: 'Master of Divinity', year: 2000 },
      { school: 'University of Toronto', degree: 'Bachelor of Arts in Classics', year: 1996 }
    ]
  },
  {
    name: 'Pastor James Wilson',
    denomination: 'Methodist',
    experience: 30,
    phoneNumber: '(780) 555-0107',
    city: 'Edmonton',
    professions: ['Sermon Delivery', 'Denominational Leadership', 'Ministerial Training'],
    education: [
      { school: 'Vancouver School of Theology', degree: 'Doctor of Ministry', year: 2005 },
      { school: 'Methodist College', degree: 'Master of Divinity', year: 1998 }
    ]
  },
  {
    name: 'Rev. Maria Garcia',
    denomination: 'Pentecostal',
    experience: 16,
    phoneNumber: '(902) 555-0108',
    city: 'Halifax',
    professions: ['Sermon Delivery', 'Missionary Work', 'International Ministry'],
    education: [
      { school: 'Assembles of God Bible College', degree: 'Diploma in Ministry', year: 2011 },
      { school: 'Acadia University', degree: 'Bachelor of Arts in Spanish', year: 2008 }
    ]
  },
  {
    name: 'Pastor Daniel Lee',
    denomination: 'Evangelical',
    experience: 19,
    phoneNumber: '(418) 555-0109',
    city: 'Quebec City',
    professions: ['Sermon Delivery', 'Church Planting', 'Discipleship Training'],
    education: [
      { school: 'Canadian Bible College', degree: 'Master of Arts in Theology', year: 2009 },
      { school: 'Université Laval', degree: 'Bachelor of Arts in Philosophy', year: 2005 }
    ]
  },
  {
    name: 'Rev. Jessica Anderson',
    denomination: 'Baptist',
    experience: 24,
    phoneNumber: '(519) 555-0110',
    city: 'London',
    professions: ['Sermon Delivery', 'Women Ministry', 'Congregational Counseling'],
    education: [
      { school: 'Canadian Baptist Seminary', degree: 'Master of Divinity', year: 2004 },
      { school: 'Western University', degree: 'Bachelor of Arts in Counseling Psychology', year: 2001 }
    ]
  }
];

// Function to create resume PDF
function generateResumePDF(preacher, outputDir) {
  return new Promise((resolve, reject) => {
    const filename = `${preacher.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`;
    const filepath = path.join(outputDir, filename);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);

    doc.pipe(stream);

    // Header with name
    doc.fontSize(20).font('Helvetica-Bold').text(preacher.name);
    doc.fontSize(10).font('Helvetica').text(`${preacher.denomination} Minister | ${preacher.city}, Canada`);
    doc.text(`Phone: ${preacher.phoneNumber}`);
    doc.moveDown(0.5);

    // Professional Summary
    doc.fontSize(12).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.fontSize(10).font('Helvetica');
    doc.text(
      `Highly experienced ${preacher.denomination} minister with ${preacher.experience} years of dedicated service in ministry. Proven track record in spiritual leadership, congregation development, and pastoral care. Committed to delivering inspiring sermons and fostering meaningful spiritual growth in diverse communities.`,
      { width: 495, align: 'left' }
    );
    doc.moveDown(0.5);

    // Core Competencies
    doc.fontSize(12).font('Helvetica-Bold').text('CORE COMPETENCIES');
    doc.fontSize(10).font('Helvetica');
    const competencies = preacher.professions.join(' • ');
    doc.text(competencies, { width: 495, align: 'left' });
    doc.moveDown(0.5);

    // Education
    doc.fontSize(12).font('Helvetica-Bold').text('EDUCATION');
    doc.fontSize(10).font('Helvetica');
    preacher.education.forEach((edu) => {
      doc.font('Helvetica-Bold').text(`${edu.degree}`);
      doc.font('Helvetica').text(`${edu.school} | ${edu.year}`);
      doc.moveDown(0.3);
    });
    doc.moveDown(0.3);

    // Ministry Experience
    doc.fontSize(12).font('Helvetica-Bold').text('MINISTRY EXPERIENCE');
    doc.fontSize(10).font('Helvetica');
    doc.font('Helvetica-Bold').text(`Senior Minister | ${preacher.denomination} Church (${new Date().getFullYear() - Math.floor(preacher.experience / 2)} - Present)`);
    doc.font('Helvetica').text(
      `Led spiritual direction, sermon delivery, and pastoral ministry while fostering congregational growth and community engagement. Developed specialized programs and mentored emerging ministry leaders.`,
      { width: 495 }
    );
    doc.moveDown(0.3);

    // Additional Info
    doc.fontSize(10).font('Helvetica-Bold').text('ORDINATION & CREDENTIALS');
    doc.font('Helvetica').text(`Ordained ${preacher.denomination} Minister | Active in denominational leadership`);
    doc.moveDown(0.3);

    // References
    doc.fontSize(10).font('Helvetica').text('References available upon request.');

    doc.end();

    stream.on('finish', () => {
      console.log(`✅ Created resume: ${filename}`);
      resolve(filepath);
    });

    stream.on('error', (err) => {
      console.error(`❌ Error creating ${filename}:`, err);
      reject(err);
    });
  });
}

// Main execution
async function main() {
  const resumeDir = path.join(__dirname, '..', 'public', 'resumes');

  // Create resumes directory if it doesn't exist
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
    console.log(`📁 Created resumes directory: ${resumeDir}`);
  }

  console.log('\n🔨 Generating resume PDFs...\n');

  try {
    for (const preacher of preachers) {
      await generateResumePDF(preacher, resumeDir);
    }

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('✨ ALL RESUME PDFs GENERATED SUCCESSFULLY!');
    console.log('════════════════════════════════════════════════════════════\n');
    console.log('Resumes available at: /public/resumes/\n');

    // Generate mapping for seed script
    console.log('Resume URLs for seed script:');
    preachers.forEach((preacher) => {
      const filename = `${preacher.name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`;
      console.log(`  ${preacher.name}: /resumes/${filename}`);
    });
  } catch (error) {
    console.error('❌ Error generating resumes:', error);
    process.exit(1);
  }
}

main();
