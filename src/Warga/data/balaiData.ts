export interface BalaiDetail {
  name: string;
  location: string; // Kota domisili kantor
  address: string;
  phone: string;
  email: string;
  workingArea: string; // Detail wilayah yang dilayani
}

export interface Region {
  id: string;
  name: string;
  description: string;
}

export interface BalaiRegionMapping {
  regionId: string;
  offices: BalaiDetail[];
}

export const REGIONS: Region[] = [
  { id: 'sumatera', name: 'Pulau Sumatera', description: 'Wilayah kerja mencakup seluruh provinsi di Pulau Sumatera yang terbagi ke dalam 5 wilayah Balai.' },
  { id: 'jawa', name: 'Pulau Jawa', description: 'Wilayah kerja mencakup seluruh provinsi di Pulau Jawa yang terbagi ke dalam 4 wilayah Balai.' },
  { id: 'kalimantan', name: 'Pulau Kalimantan', description: 'Wilayah kerja mencakup seluruh provinsi di Pulau Kalimantan yang terbagi ke dalam 2 wilayah Balai.' },
  { id: 'sulawesi', name: 'Pulau Sulawesi', description: 'Wilayah kerja mencakup seluruh provinsi di Pulau Sulawesi dan Maluku Utara yang terbagi ke dalam 3 wilayah Balai.' },
  { id: 'nusa-tenggara', name: 'Pulau Nusa Tenggara', description: 'Wilayah kerja mencakup Bali, NTB, dan NTT yang terbagi ke dalam 2 wilayah Balai.' },
  { id: 'maluku', name: 'Pulau Maluku', description: 'Wilayah kerja mencakup Provinsi Maluku.' },
  { id: 'papua', name: 'Pulau Papua', description: 'Wilayah kerja mencakup seluruh provinsi di Pulau Papua yang terbagi ke dalam 2 wilayah Balai.' },
];

export const DETAILED_BALAI_LIST: BalaiRegionMapping[] = [
  { 
    regionId: 'sumatera', 
    offices: [
      { 
        name: 'Kantor Balai 1', 
        location: 'Kota Banda Aceh',
        address: 'Jl. Jend Sudirman No. 32 Lamtemen Timur, Kota Banda Aceh', 
        phone: '(0651) 23230', 
        email: '',
        workingArea: 'Provinsi Nanggroe Aceh Darussalam' 
      },
      { 
        name: 'Kantor Balai 2', 
        location: 'Kota Medan',
        address: 'Jl. Suluh No.99 A, Kel. Sidorejo Hilir, Kec. Medan Tembung, Kota Medan', 
        phone: '(061) 80032544', 
        email: '',
        workingArea: 'Provinsi Sumatera Utara' 
      },
      { 
        name: 'Kantor Balai 3', 
        location: 'Kota Pekanbaru',
        address: 'Jl. Diponegoro No. 45, Kel. Cinta Raja, Kec. Sail, Kota Pekanbaru', 
        phone: '(0761) 21234', 
        email: '',
        workingArea: 'Provinsi Sumatera Barat, Riau, dan Kepulauan Riau' 
      },
      { 
        name: 'Kantor Balai 4', 
        location: 'Kota Jambi',
        address: 'Jl. Letjend Suprapto No.28.A, Telanaipura, Kota Jambi', 
        phone: '(0741) 62419', 
        email: '',
        workingArea: 'Provinsi Jambi dan Bengkulu' 
      },
      { 
        name: 'Kantor Balai 5', 
        location: 'Kota Palembang',
        address: 'Jl. Jenderal Sudirman/ Inspektur Yazid No.7490, Km 2,5 Kota Palembang', 
        phone: '089616937444', 
        email: '',
        workingArea: 'Provinsi Sumatera Selatan, Bangka Belitung, dan Lampung' 
      }
    ] 
  },
  { 
    regionId: 'jawa', 
    offices: [
      { 
        name: 'Kantor Balai 1', 
        location: 'Jakarta Selatan',
        address: 'Gedung Wisma Karya, Jl. Wijaya I No.59, Petogogan, Kebayoran Baru, Jakarta Selatan', 
        phone: '(021) 72796158', 
        email: '',
        workingArea: 'Provinsi DK Jakarta dan Banten' 
      },
      { 
        name: 'Kantor Balai 2', 
        location: 'Kota Bandung',
        address: 'Jl. Lengkong Besar No. 10, Cikawao, Kec. Lengkong, Kota Bandung', 
        phone: '(022) 4203643', 
        email: '',
        workingArea: 'Provinsi Jawa Barat' 
      },
      { 
        name: 'Kantor Balai 3', 
        location: 'Kab. Sleman',
        address: 'Jl. Laksda Adisucipto No. 165, Catur Tunggal, Kec. Depok, Kab. Sleman', 
        phone: '(0274) 514330', 
        email: '',
        workingArea: 'Provinsi Jawa Tengah dan D.I. Yogyakarta' 
      },
      { 
        name: 'Kantor Balai 4', 
        location: 'Kota Surabaya',
        address: 'Jl. Gayung Kebonsari No. 50, Ketintang, Kota Surabaya', 
        phone: '(031) 8292143', 
        email: '',
        workingArea: 'Provinsi Jawa Timur' 
      }
    ] 
  },
  { 
    regionId: 'kalimantan', 
    offices: [
      { 
        name: 'Kantor Balai 1', 
        location: 'Kota Pontianak',
        address: 'Jl. Imam Bonjol No. 116, Benua Melayu Darat, Kec. Pontianak Selatan, Kota Pontianak', 
        phone: '(0561) 732047', 
        email: '',
        workingArea: 'Provinsi Kalimantan Barat dan Kalimantan Tengah' 
      },
      { 
        name: 'Kantor Balai 2', 
        location: 'Kota Samarinda',
        address: 'Jl. Cendana No. 167 Kompleks PDAM, Kota Samarinda', 
        phone: '(0541) 741635', 
        email: '',
        workingArea: 'Provinsi Kalimantan Selatan, Kalimantan Timur, dan Kalimantan Utara' 
      }
    ] 
  },
  { 
    regionId: 'sulawesi', 
    offices: [
      { 
        name: 'Kantor Balai 1', 
        location: 'Kota Manado',
        address: 'Jl. Ringroad I, Ruko Business 8 Blok B No. 69, Kel. Taas, Kec. Tikala, Kota Manado', 
        phone: '(0431) 852234', 
        email: 'balaipnpsul1@gmail.com',
        workingArea: 'Provinsi Sulawesi Utara, Gorontalo, dan Maluku Utara' 
      },
      { 
        name: 'Kantor Balai 2', 
        location: 'Kota Palu',
        address: 'Jl. Sungai Surumana No. 35, Siranindi, Kec. Palu Barat, Kota Palu', 
        phone: '(0451) 422033', 
        email: '',
        workingArea: 'Provinsi Sulawesi Tengah dan Sulawesi Barat' 
      },
      { 
        name: 'Kantor Balai 3', 
        location: 'Kota Makassar',
        address: 'Jl. Penjernihan Raya No. 22, Komp. PDAM Panakkukang, Kota Makassar', 
        phone: '(0411) 442234', 
        email: '',
        workingArea: 'Provinsi Sulawesi Selatan dan Sulawesi Tenggara' 
      }
    ] 
  },
  { 
    regionId: 'nusa-tenggara', 
    offices: [
      { 
        name: 'Kantor Balai 1', 
        location: 'Kab. Lombok Barat',
        address: 'Jl. TGH. Faesal No. 555, Bengkel, Kec. Labuapi, Kab. Lombok Barat', 
        phone: '(0370) 633120', 
        email: '',
        workingArea: 'Provinsi Nusa Tenggara Barat dan Bali' 
      },
      { 
        name: 'Kantor Balai 2', 
        location: 'Kota Kupang',
        address: 'Jl. W.J. Lalamentik No. 20, Kec. Oebobo, Kota Kupang', 
        phone: '(0380) 821360', 
        email: '',
        workingArea: 'Provinsi Nusa Tenggara Timur' 
      }
    ] 
  },
  { 
    regionId: 'maluku', 
    offices: [
      { 
        name: 'Kantor Balai', 
        location: 'Kota Ambon',
        address: 'Jl. Mr. Chr. Soplanit, Rumah Tiga, Kec. Teluk Ambon, Kota Ambon', 
        phone: '(0911) 352125', 
        email: '',
        workingArea: 'Provinsi Maluku' 
      }
    ] 
  },
  { 
    regionId: 'papua', 
    offices: [
      { 
        name: 'Kantor Balai 1', 
        location: 'Kota Jayapura',
        address: 'Kompleks Ruko, Jl. Kelapa Dua Entrop, Kec. Jayapura Selatan, Kota Jayapura', 
        phone: '(0967) 581125', 
        email: '',
        workingArea: 'Provinsi Papua, Papua Tengah, Papua Pegunungan, dan Papua Selatan' 
      },
      { 
        name: 'Kantor Balai 2', 
        location: 'Kab. Manokwari',
        address: 'Jl. Merdeka Kel. Padarni, Kec. Manokwari Barat, Kab. Manokwari', 
        phone: '(0986) 211234', 
        email: '',
        workingArea: 'Provinsi Papua Barat dan Papua Barat Daya' 
      }
    ] 
  },
];