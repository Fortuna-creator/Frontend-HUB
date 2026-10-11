import type { Consultation } from '../../types/types';

// Helper to get relative dates
const today = new Date();
const getDate = (offsetCays: number): string => {
    const d = new Date(today);
    d.setDate(today.getDate() + offsetCays);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

export const MOCK_CONSULTATIONS: Consultation[] = [
    // TODAY'S SCHEDULE - DEMO USER (u-101)
    {
        id: 'k-001',
        user: {
            id: 'u-101',
            name: 'Ari Guniv',
            phone: '0812-3456-7890',
            email: 'ari.guniv@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Ari+Guniv&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(0),
        timeSlot: '07.00 - 08.00',
        status: 'selesai',
        consultationId: 'KPVP-PQRX-894L',
        topic: 'Struktur Bangunan',
        description: 'Konsultasi mengenai ketahanan gempa.'
    },
    {
        id: 'k-007',
        user: {
            id: 'u-101',
            name: 'Ari Guniv',
            phone: '0812-3456-7890',
            email: 'ari.guniv@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Ari+Guniv&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(0),
        timeSlot: '09.00 - 10.00',
        status: 'terkonfirmasi',
        consultationId: 'PGVGI-TTPO-780H',
        topic: 'Perizinan',
        description: 'Tanya jawab seputar IMB dan persyaratan teknis.'
    },
    {
        id: 'k-008',
        user: {
            id: 'u-101',
            name: 'Ari Guniv',
            phone: '0812-3456-7890',
            email: 'ari.guniv@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Ari+Guniv&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(1),
        timeSlot: '11.00 - 12.00',
        status: 'terkonfirmasi',
        consultationId: 'ABCD-EFGH-1234',
        topic: 'Desain Arsitektur',
        description: 'Review desain rumah tinggal type 45 dengan standar bangunan.'
    },
    // OTHER USERS
    {
        id: 'k-002',
        user: {
            id: 'u-102',
            name: 'Adi Setiawan',
            phone: '0813-9876-5432',
            email: 'adi.setiawan@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Adi+Setiawan&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(0),
        timeSlot: '13.00 - 14.00',
        status: 'selesai',
        consultationId: 'PGVGI-TTPO-781H',
        topic: 'Perizinan',
        description: 'Tanya jawab seputar IMB.'
    },
    {
        id: 'k-003',
        user: {
            id: 'u-103',
            name: 'Muhammad Ryan Susilo',
            phone: '0812-1967-5534',
            email: 'ryan.susilo@gmail.com',
            avatar: 'https://ui-avatars.com/api/?name=Muhammad+Ryan&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(0),
        timeSlot: '15.00 - 16.00',
        status: 'sedang_berjalan',
        topic: 'Desain Arsitektur',
        description: 'Review desain rumah tinggal type 45.'
    },
    {
        id: 'k-004',
        user: {
            id: 'u-104',
            name: 'Kirana Larasati',
            phone: '0856-7788-9900',
            email: 'kirana.larasati@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Kirana+Larasati&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(0),
        timeSlot: '16.00 - 17.00',
        status: 'terkonfirmasi',
        topic: 'Material Bangunan',
        description: 'Konsultasi pemilihan semen yang tepat.'
    },
    // FUTURE DATES
    {
        id: 'k-005',
        user: {
            id: 'u-105',
            name: 'Budi Santoso',
            phone: '0811-2233-4455',
            email: 'budi.santoso@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(2), // 2 days from now
        timeSlot: '10.00 - 11.00',
        status: 'menunggu_konfirmasi',
        topic: 'Konstruksi Jalan',
        description: 'Pembangunan jalan desa.'
    },
    {
        id: 'k-006',
        user: {
            id: 'u-106',
            name: 'Siti Aminah',
            phone: '0877-6655-4433',
            email: 'siti.aminah@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=random'
        },
        balaiLocation: 'Balai Jawa 1',
        date: getDate(3),
        timeSlot: '14.00 - 15.00',
        status: 'terkonfirmasi',
        topic: 'Sanitasi',
        description: 'Perencanaan sistem sanitasi lingkungan.'
    }
];
