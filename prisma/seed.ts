import { PrismaClient, Role, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const imgs = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'
];

const categories = ['Technology', 'Hackathons', 'AI/ML', 'Cloud Computing', 'Cybersecurity', 'Web Development', 'Workshops', 'Cultural', 'Music', 'Dance', 'Sports', 'Entrepreneurship', 'Startups', 'Design', 'Photography', 'Clubs', 'Competitions', 'Networking', 'Career', 'Gaming'];
const organizers = ['ACM Student Chapter', 'Tech Society', 'Design Club', 'Sports Council', 'Google Developer Student Club', 'IEEE Student Branch', 'Entrepreneurship Cell', 'Photography Club', 'Dance Troupe', 'Music Society'];
const venues = ['Main Auditorium', 'Tech Park, Lab 2', 'Block 5, Room 204', 'Digital Library', 'University Amphitheatre', 'SRM Grounds', 'Mini Auditorium', 'Dr. T. P. Ganesan Auditorium', 'Innovation Lab', 'Block 4, Seminar Hall', 'Robotics Centre', 'Green Amphitheatre', 'CS Dept Seminar Hall', 'Student Center'];

const baseEvents = [
  'AI Builders Night', 'SRM Hack Night', 'Cloud Native Workshop', 'Open Source Saturday', 'Startup Pitch Arena',
  'Cybersecurity CTF', 'Design Systems Meetup', 'Photography Walk', 'Inter-College Football Cup', 'TechTalk: Building with AI',
  'Women in Tech Meetup', 'React Performance Workshop', 'Git & GitHub Bootcamp', 'Product Design Sprint', 'FinTech Innovation Challenge',
  'Robotics Showcase', 'Campus Startup Demo Day', 'Photography Masterclass', 'CodeChef Competitive Programming Night', 'Machine Learning Study Jam',
  'Blockchain Fundamentals', 'Web3 DApp Workshop', 'Data Science Hackathon', 'Ethical Hacking 101', 'IoT Innovation Challenge',
  'UI/UX Prototyping Workshop', 'Creative Writing Session', 'Annual Tech Symposium', 'Esports Tournament', 'App Development Bootcamp',
  'Cloud Architecture Deep Dive', 'Quantum Computing Seminar', 'DevOps Best Practices', 'AR/VR Experience Day', '3D Modeling Workshop',
  'Cyber Defense Competition', 'Music Production Masterclass', 'Indie Game Dev Meetup', 'Renewable Energy Seminar', 'Aerospace Engineering Expo',
  'BioTech Research Symposium', 'Open Mic Night', 'Standup Comedy Showcase', 'Classical Music Evening', 'Street Dance Battle',
  'Basketball Championship', 'Volleyball Inter-Department', 'Cricket League', 'Table Tennis Tournament', 'Chess Masterclass',
  'Debate Club Meeting', 'Model United Nations', 'Entrepreneurship Summit', 'Venture Capital Networking', 'Marketing Case Study',
  'Finance Workshop', 'Personal Branding Seminar', 'Resume Building Session', 'Mock Interviews', 'Alumni Networking Dinner',
  'Mental Health Awareness', 'Yoga and Meditation', 'Art Exhibition', 'Pottery Workshop', 'Theater Production',
  'Short Film Festival', 'Podcasting 101', 'Language Exchange Meetup', 'Cultural Food Festival', 'Charity Run',
  'Environmental Clean-up', 'Astro-Photography Night', 'Stargazing Event', 'Math Olympiad Prep', 'Physics Quiz',
  'Chemistry Lab Tour', 'History Society Lecture', 'Philosophy Discussion', 'Political Science Debate', 'Economics Forum',
  'Mobile Photography Walk', 'Graphic Design Workshop', 'Calligraphy Session', 'Origami Masterclass', 'Magic Show',
  'Poetry Slam', 'Storytelling Night', 'Improv Comedy Workshop'
];

async function main() {
  const passwordHash = await bcrypt.hash('campusly123', 12);

  const student = await prisma.user.upsert({
    where: { email: 'student@campusly.dev' },
    update: { passwordHash, role: Role.STUDENT },
    create: { name: 'Aarav Mehta', email: 'student@campusly.dev', passwordHash, role: Role.STUDENT }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@campusly.dev' },
    update: { passwordHash, role: Role.ADMIN },
    create: { name: 'Maya Rao', email: 'admin@campusly.dev', passwordHash, role: Role.ADMIN }
  });

  for (let i = 0; i < baseEvents.length; i++) {
    const id = `demo-event-${i + 1}`;
    
    // Vary the date from 10 days in the past to 30 days in the future
    const daysOffset = (i % 40) - 10; 
    const date = new Date(Date.now() + daysOffset * 86400000);
    
    let status = EventStatus.UPCOMING;
    if (daysOffset < 0) {
      status = EventStatus.COMPLETED;
    } else if (i % 25 === 0) {
      status = EventStatus.CANCELLED;
    }

    const title = baseEvents[i];
    const category = categories[i % categories.length];
    const organizer = organizers[i % organizers.length];
    const venue = venues[i % venues.length];
    
    const startTime = (10 + (i % 8)).toString().padStart(2, '0') + ":00";
    const endTime = (12 + (i % 8)).toString().padStart(2, '0') + ":30";
    
    // Vary capacities: 50, 75, 100, 150, 200, 300, 500
    const capacities = [50, 75, 100, 150, 200, 300, 500];
    const capacity = capacities[i % capacities.length];

    await prisma.event.upsert({
      where: { id },
      update: {
        title, category, venue, date, startTime, endTime, organizer, capacity, status, image: imgs[i % imgs.length]
      },
      create: {
        id,
        title,
        description: `Join us for ${title}, an exciting event brought to you by ${organizer}. Whether you're looking to learn new skills, network with peers, or simply have a great time, this is the perfect opportunity. Don't miss out on what promises to be an engaging and enriching experience for everyone involved.`,
        category,
        venue,
        date,
        startTime,
        endTime,
        organizer,
        capacity,
        image: imgs[i % imgs.length],
        status
      }
    });
  }

  // Registrations
  // Register student 1 for about 12 events
  for (let i = 0; i < 12; i++) {
    const eventId = `demo-event-${(i * 3) + 1}`; // 1, 4, 7, 10...
    await prisma.registration.upsert({
      where: {
        userId_eventId: { userId: student.id, eventId }
      },
      update: {}, // preserve status and timestamp
      create: {
        userId: student.id,
        eventId,
        registeredAt: new Date(Date.now() - (i * 3600000))
      }
    });
  }
  
  // Create some extra registrations to simulate almost full
  const eventToFill = await prisma.event.findUnique({ where: { id: 'demo-event-1' } });
  if (eventToFill) {
     const count = await prisma.registration.count({ where: { eventId: 'demo-event-1' } });
     if (count < 48) {
       for (let i = count; i < 48; i++) {
         const dummyUser = await prisma.user.upsert({
           where: { email: `dummy${i}@campusly.dev` },
           update: {},
           create: { name: `Dummy User ${i}`, email: `dummy${i}@campusly.dev`, passwordHash, role: Role.STUDENT }
         });
         await prisma.registration.upsert({
           where: { userId_eventId: { userId: dummyUser.id, eventId: 'demo-event-1' } },
           update: {},
           create: { userId: dummyUser.id, eventId: 'demo-event-1' }
         });
       }
     }
  }
  
  const eventToFill2 = await prisma.event.findUnique({ where: { id: 'demo-event-2' } });
  if (eventToFill2) {
     const count2 = await prisma.registration.count({ where: { eventId: 'demo-event-2' } });
     if (count2 < 75) {
       for (let i = count2; i < 75; i++) {
         const dummyUser = await prisma.user.upsert({
           where: { email: `dummy2_${i}@campusly.dev` },
           update: {},
           create: { name: `Dummy User 2_${i}`, email: `dummy2_${i}@campusly.dev`, passwordHash, role: Role.STUDENT }
         });
         await prisma.registration.upsert({
           where: { userId_eventId: { userId: dummyUser.id, eventId: 'demo-event-2' } },
           update: {},
           create: { userId: dummyUser.id, eventId: 'demo-event-2' }
         });
       }
     }
  }

}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
