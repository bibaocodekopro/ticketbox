const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Xóa dữ liệu cũ
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.event.deleteMany();
    await prisma.venue.deleteMany();
    await prisma.user.deleteMany();

    console.log("Đã xóa dữ liệu cũ ✅");

    // Tạo venue mẫu
    const venues = await prisma.venue.createMany({
        data: [
            { name: "Sân Vận Động Thống Nhất", location: "Quận 10, TP. Hồ Chí Minh" },
            { name: "Sân Vận Động Quân Khu 7", location: "Quận Tân Bình, TP. Hồ Chí Minh" },
            { name: "Nhà Thi Đấu Phú Thọ", location: "Quận 11, TP. Hồ Chí Minh" },
            { name: "Nhà Hát Hòa Bình", location: "Quận 10, TP. Hồ Chí Minh" },
            { name: "Công Viên Văn Hóa Đầm Sen", location: "Quận 11, TP. Hồ Chí Minh" },
            { name: "Galaxy Cinema", location: "Quận 1, TP. Hồ Chí Minh" },
        ]
    });

    console.log("Đã tạo venues ✅");

    const titles = [
        "Saigon Music Carnival",
        "Electric Summer Festival",
        "Chill Vibes Acoustic",
        "Urban Beat Concert",
        "City Sound Explosion",
        "Night Of The Stars",
        "Saigon Live Arena",
        "Festival Of Lights",
        "Young Talent Showcase",
        "Mega Music Party",
        "Saigon Soundwave",
        "Rhythm City Live"
    ];

    const artists = [
        "Đạt G", "AMEE", "HIEUTHUHAI", "tlinh", "Karik",
        "JSOL", "LyLy", "Vũ", "Obito", "RPT Gonzo",
        "Binz", "Mỹ Tâm", "Sơn Tùng M-TP", "Grey D", "Wren Evans",
        "Vũ Cát Tường", "Trúc Nhân", "Hứa Kim Tuyền", "Bray", "MCK"
    ];

    const descriptions = [
        "Sự kiện âm nhạc ngoài trời với không gian rộng lớn và sôi động.",
        "Đêm diễn quy tụ nhiều nghệ sĩ trẻ đang được yêu thích.",
        "Chương trình âm nhạc hoành tráng với hệ thống âm thanh ánh sáng hiện đại.",
        "Một đêm nhạc đầy năng lượng dành cho cộng đồng yêu âm nhạc.",
        "Sự kiện đặc biệt mang đến những màn trình diễn live bùng nổ.",
        "Không gian giải trí kết hợp âm nhạc, ánh sáng và hiệu ứng sân khấu đặc sắc."
    ];

    const randomInt = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const now = new Date();

    // Lấy danh sách venue vừa tạo
    const allVenues = await prisma.venue.findMany();
    if (allVenues.length === 0) {
        console.error("Không có venue nào!");
        return;
    }

    // Tạo 100 event random
    for (let i = 0; i < 100; i++) {
        const addDays = randomInt(1, 120);
        const addHours = randomInt(18, 22);

        const start = new Date(now);
        start.setDate(start.getDate() + addDays);
        start.setHours(addHours, 0, 0, 0);

        const randomTitle = titles[randomInt(0, titles.length - 1)];
        const randomArtist = artists[randomInt(0, artists.length - 1)];
        const randomDesc = descriptions[randomInt(0, descriptions.length - 1)];
        const randomVenue = allVenues[randomInt(0, allVenues.length - 1)];

        const event = await prisma.event.create({
            data: {
                title: `${randomTitle} - ${randomArtist} #${i + 1}`,
                description: `${randomDesc} Sự góp mặt của ${randomArtist} hứa hẹn sẽ mang đến một đêm diễn bùng nổ.`,
                startTime: start,
                venueId: randomVenue.id,
                image: `https://picsum.photos/seed/event-${i}/1200/600`
            }
        });

        // Tạo số ghế random cho mỗi event (50–150 ghế)
        const totalSeats = randomInt(50, 150);
        const seats = [];

        for (let j = 1; j <= totalSeats; j++) {
            seats.push({
                seatNumber: `A${j}`,
                price: randomInt(300000, 1000000),
                eventId: event.id
            });
        }

        await prisma.seat.createMany({ data: seats });
        console.log(`Created event ${i + 1} with ${totalSeats} seats`);
    }

    // Tạo user mẫu
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('123456', 10);

    await prisma.user.create({
        data: {
            email: 'demo@ticketbox.com',
            password: hashedPassword,
            role: 'USER'
        }
    });

    await prisma.user.create({
        data: {
            email: 'admin@ticketbox.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log("🔥 Seed random done! 100 events created.");
    console.log("📧 Demo user: demo@ticketbox.com / 123456");
    console.log("📧 Admin user: admin@ticketbox.com / 123456");
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
