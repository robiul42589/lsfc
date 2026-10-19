import { AppStateData } from '../types';

export const initialAppData: AppStateData = {
  version: 1,
  lastBackupDate: new Date().toISOString(),
  organization: {
    name: 'ভূমি সেবা কেন্দ্র (উপজেলা ডিজিটাল সেন্টার), নন্দীগ্রাম, বগুড়া',
    shortName: 'নন্দীগ্রাম ডিজিটাল সেন্টার',
    centerType: 'উপজেলা ডিজিটাল সেন্টার ও ভূমি সেবা কেন্দ্র',
    upazila: 'নন্দীগ্রাম',
    district: 'বগুড়া',
    division: 'রাজশাহী',
    address: 'উপজেলা পরিষদ চত্বর, পোস্ট: নন্দীগ্রাম-৫৮৬০, বগুড়া',
    establishedYear: '২০১৩',
    registrationNumber: 'UDC-RAJ-BOG-NDG-0042',
    phone: '০১৭০০-১২৩৪৫৬ / ০১৯১১-৯৮৭৬৫৪',
    email: 'udc.nandigram.bogura@gmail.com',
    website: 'https://nandigram.bogura.gov.bd',
    inChargeName: 'মোঃ রবিউল ইসলাম',
    inChargeDesignation: 'উদ্যোক্তা ও পরিচালক',
    inChargePhone: '০১৭০০-১২৩৪৫৬',
    logoUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300&auto=format&fit=crop&q=80',
    about: 'ভূমি সেবা কেন্দ্র ও উপজেলা ডিজিটাল সেন্টার, নন্দীগ্রাম, বগুড়া উপজেলার জনগণের দ্বারপ্রান্তে সকল প্রকার ডিজিটাল সরকারি ও বেসরকারি সেবা (ই-নামজারি খারিজ, খতিয়ান, ই-দাখিলা, জন্ম নিবন্ধন, ইত্যাদি) দ্রুত ও বিশ্বস্ততার সাথে পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।',
    citizenCharter: [
      'ই-নামজারি (খারিজ) আবেদন ও নিষ্পত্তির ট্র্যাকিং সেবা',
      'সিএস, এসএ, আরএস ও বিএস খতিয়ান বা পর্চা অনলাইন উত্তোলন',
      'অনলাইনে ভূমি উন্নয়ন কর (ই-দাখিলা) চেক ও পরিশোধ',
      'মৌজা ম্যাপ বা নকশার অনলাইন আবেদন',
      'অনলাইন জন্ম ও মৃত্যু নিবন্ধন আবেদন ও সংশোধন',
      'জাতীয় পরিচয়পত্র সংক্রান্ত তথ্য সংশোধন ও প্রিন্ট',
      'পাসপোর্ট আবেদন ও পুলিশ ক্লিয়ারেন্স ফরম পূরণ',
      'পাসপোর্ট সাইজ রঙিন ছবি, লেমিনেটিং ও দ্রুত ফটোকপি',
      'কম্পিউটার টাইপিং, কম্পোজ, স্ক্যানিং ও ইন্টারনেট ব্রাউজিং'
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'উপজেলা ডিজিটাল সেন্টার চুক্তিপত্র ও উদ্যোক্তা সনদ',
        type: 'চুক্তিপত্র (Deed / Agreement)',
        uploadDate: '2025-01-15',
        fileName: 'UDC_Agreement_Nandigram.pdf',
        fileSize: '345 KB',
        mimeType: 'application/pdf'
      },
      {
        id: 'doc-2',
        title: 'হালনাগাদ ট্রেড লাইসেন্স (২০২৫-২০২৬)',
        type: 'ট্রেড লাইসেন্স (Trade License)',
        uploadDate: '2025-07-01',
        fileName: 'Trade_License_2025_26.pdf',
        fileSize: '280 KB',
        mimeType: 'application/pdf'
      },
      {
        id: 'doc-3',
        title: 'ভূমি সেবা কেন্দ্র অনুমোদন ও সিটিজেন চার্টার গাইডলাইন',
        type: 'সরকারি অনুমোদন (Govt Approval)',
        uploadDate: '2025-03-10',
        fileName: 'Bhumi_Seba_Charter_Approved.pdf',
        fileSize: '512 KB',
        mimeType: 'application/pdf'
      }
    ]
  },
  employees: [
    {
      id: 'emp-1',
      employeeCode: 'EMP-001',
      name: 'মোঃ রবিউল ইসলাম',
      designation: 'উদ্যোক্তা ও পরিচালক',
      phone: '০১৭০০-১২৩৪৫৬',
      email: 'robiul.nandigram@gmail.com',
      nid: '১৯৯১১০১২৩৪৫৬৭৮৯০১',
      dateOfBirth: '1991-04-12',
      bloodGroup: 'B+',
      joiningDate: '2013-03-01',
      baseSalary: 28000,
      status: 'active',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      signatureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      fatherName: 'মোঃ আব্দুল জলিল',
      motherName: 'মোছাঃ রোকেয়া বেগম',
      emergencyContact: '০১৮১২-৯৯৮৮৭৭',
      maritalStatus: 'married',
      spouseName: 'মোছাঃ শারমিন আক্তার',
      childrenCount: 2,
      childrenDetails: 'পুত্র: রায়ান ইসলাম (৮ বছর), কন্যা: রুবাইয়া ইসলাম (৪ বছর)',
      educationList: [
        { id: 'edu-1', degree: 'বি.এস.সি (কম্পিউটার সায়েন্স)', institute: 'রাজশাহী কলেজ / জাতীয় বিশ্ববিদ্যালয়', passingYear: '2012', result: '১ম শ্রেণী' },
        { id: 'edu-2', degree: 'এইচ.এস.সি (বিজ্ঞান)', institute: 'নন্দীগ্রাম মনসুর হোসেন ডিগ্রি কলেজ', passingYear: '2008', result: 'GPA 4.80' }
      ],
      trainingList: [
        { id: 'trn-1', title: 'ই-নামজারি ও ডিজিটাল ভূমি ব্যবস্থাপনা প্রশিক্ষণ', institute: 'ভূমি প্রশাসন প্রশিক্ষণ কেন্দ্র (LATC)', duration: '৩ সপ্তাহ', completionYear: '2021' },
        { id: 'trn-2', title: 'এটুআই (a2i) ডিজিটাল সেন্টার উদ্যোক্তা ক্যাপাসিটি ট্রেনিং', institute: 'আইসিটি বিভাগ, ঢাকা', duration: '১ মাস', completionYear: '2014' }
      ]
    },
    {
      id: 'emp-2',
      employeeCode: 'EMP-002',
      name: 'মোছাঃ জান্নাতুল ফেরদৌস',
      designation: 'সহকারী কম্পিউটার অপারেটর',
      phone: '০১৭২২-৩৩৪৪৫৫',
      email: 'jannat.udc@gmail.com',
      nid: '১৯৯৬১০৯৮৭৬৫৪৩২১০৯',
      dateOfBirth: '1996-08-19',
      bloodGroup: 'A+',
      joiningDate: '2020-02-15',
      baseSalary: 16500,
      status: 'active',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      signatureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      fatherName: 'মোঃ ফরহাদ হোসেন',
      motherName: 'মোছাঃ ফরিদা বেগম',
      emergencyContact: '০১৭২২-৩৩৪৪৫৬',
      maritalStatus: 'married',
      spouseName: 'মোঃ শরিফুল ইসলাম',
      childrenCount: 1,
      childrenDetails: 'পুত্র: আরিয়ান ইসলাম (২ বছর)',
      educationList: [
        { id: 'edu-3', degree: 'বি.এ (সম্মান)', institute: 'বগুড়া সরকারি আজিজুল হক কলেজ', passingYear: '2018', result: 'CGPA 3.25' },
        { id: 'edu-4', degree: 'এইচ.এস.সি (মানবিক)', institute: 'নন্দীগ্রাম মহিলা কলেজ', passingYear: '2014', result: 'GPA 4.40' }
      ],
      trainingList: [
        { id: 'trn-3', title: 'অ্যাডভান্সড ডাটা এন্ট্রি ও গ্রাফিক্স ডিজাইন', institute: 'যুব উন্নয়ন অধিদপ্তর, বগুড়া', duration: '৬ মাস', completionYear: '2019' }
      ]
    },
    {
      id: 'emp-3',
      employeeCode: 'EMP-003',
      name: 'মোঃ তানভীর আহমেদ',
      designation: 'হিসাবরক্ষক ও কাস্টমার সার্ভিস এক্সিকিউটিভ',
      phone: '০১৮৩৩-৪৪৩৩২২',
      email: 'tanvir.acc@gmail.com',
      nid: '১৯৯৭৫০১১২৩৪৫৫৬৬৭৭',
      dateOfBirth: '1997-11-05',
      bloodGroup: 'O+',
      joiningDate: '2021-08-01',
      baseSalary: 15000,
      status: 'active',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      signatureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      fatherName: 'মোঃ মাহবুবুর রহমান',
      motherName: 'মোছাঃ বিলকিস বেগম',
      emergencyContact: '০১৮৩৩-৪৪০০০০',
      maritalStatus: 'unmarried',
      educationList: [
        { id: 'edu-5', degree: 'বিবিএস (হিসাববিজ্ঞান)', institute: 'বগুড়া সরকারি আজিজুল হক কলেজ', passingYear: '2020', result: 'CGPA 3.10' }
      ],
      trainingList: [
        { id: 'trn-4', title: 'ট্যালি ও ডিজিটাল একাউন্টিং সফটওয়্যার পরিচালনা', institute: 'আইসিটি ট্রেনিং একাডেমি, বগুড়া', duration: '৩ মাস', completionYear: '2021' }
      ]
    },
    {
      id: 'emp-4',
      employeeCode: 'EMP-004',
      name: 'মোঃ সুমন আলী',
      designation: 'অফিস সহকারী ও ডেলিভারি প্রতিনিধি',
      phone: '০১৯১১-২২৩৩৪৪',
      email: 'sumon.staff@gmail.com',
      nid: '২০০০০১২৩৪৫৬৭৮৯০০০',
      dateOfBirth: '2000-05-10',
      bloodGroup: 'AB+',
      joiningDate: '2023-01-10',
      baseSalary: 11000,
      status: 'active',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      signatureUrl: '',
      fatherName: 'মোঃ আমজাদ হোসেন',
      motherName: 'মোছাঃ হাসনা হেনা',
      emergencyContact: '০১৯১১-০০১১২২',
      maritalStatus: 'unmarried',
      educationList: [
        { id: 'edu-6', degree: 'এইচ.এস.সি', institute: 'নন্দীগ্রাম মনসুর হোসেন কলেজ', passingYear: '2021', result: 'GPA 3.80' }
      ],
      trainingList: [
        { id: 'trn-5', title: 'বেসিক অফিস অ্যাপ্লিকেশন ও কম্পিউটার হার্ডওয়্যার', institute: 'টেকনিক্যাল স্কুল, নন্দীগ্রাম', duration: '৩ মাস', completionYear: '2022' }
      ]
    },
    {
      id: 'emp-5',
      employeeCode: 'EMP-005',
      name: 'মোঃ রফিকুল ইসলাম',
      designation: 'সাবেক সহকারী অপারেটর',
      phone: '০১৭৫৫-৬৬৭৭৮৮',
      email: 'rafiqul.ex@gmail.com',
      nid: '১৯৯৪১২৩৪৫৬৭৮৯০১১২',
      dateOfBirth: '1994-02-14',
      bloodGroup: 'B+',
      joiningDate: '2019-06-01',
      baseSalary: 14000,
      status: 'dismissed',
      dismissalDate: '2024-11-30',
      dismissalReason: 'অফিসের নিয়ম ভঙ্গ ও অনুমতি ছাড়া একটানা অনুপস্থিতি',
      dismissalNote: 'কর্তৃপক্ষের অনুমোদনক্রমে এবং চূড়ান্ত নোটিশ প্রদানের পর বরখাস্ত করা হয়েছে। সকল বকেয়া হিসাব সম্পন্ন হয়েছে।',
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
      signatureUrl: '',
      fatherName: 'মোঃ শফিকুল আলম',
      motherName: 'মোছাঃ নাসিমা খাতুন',
      emergencyContact: '০১৭৫৫-৬৬৭৭৯৯',
      maritalStatus: 'married',
      educationList: [
        { id: 'edu-7', degree: 'এইচ.এস.সি', institute: 'বগুড়া পলিটেকনিক', passingYear: '2016', result: 'GPA 3.65' }
      ],
      trainingList: []
    }
  ],
  attendance: [
    {
      id: 'att-1',
      employeeId: 'emp-1',
      employeeName: 'মোঃ রবিউল ইসলাম',
      date: '2026-10-18',
      inTime: '08:50 AM',
      outTime: '05:30 PM',
      status: 'present',
      remarks: 'অন টাইম'
    },
    {
      id: 'att-2',
      employeeId: 'emp-2',
      employeeName: 'মোছাঃ জান্নাতুল ফেরদৌস',
      date: '2026-10-18',
      inTime: '09:05 AM',
      outTime: '05:00 PM',
      status: 'present',
      remarks: 'উপস্থিত'
    },
    {
      id: 'att-3',
      employeeId: 'emp-3',
      employeeName: 'মোঃ তানভীর আহমেদ',
      date: '2026-10-18',
      inTime: '09:20 AM',
      outTime: '05:15 PM',
      status: 'late',
      remarks: 'দেরিতে আগমন'
    },
    {
      id: 'att-4',
      employeeId: 'emp-4',
      employeeName: 'মোঃ সুমন আলী',
      date: '2026-10-18',
      inTime: '09:00 AM',
      outTime: '05:00 PM',
      status: 'present',
      remarks: 'উপস্থিত'
    },
    {
      id: 'att-5',
      employeeId: 'emp-1',
      employeeName: 'মোঃ রবিউল ইসলাম',
      date: '2026-10-17',
      inTime: '08:45 AM',
      outTime: '06:00 PM',
      status: 'present'
    },
    {
      id: 'att-6',
      employeeId: 'emp-2',
      employeeName: 'মোছাঃ জান্নাতুল ফেরদৌস',
      date: '2026-10-17',
      inTime: '09:00 AM',
      outTime: '05:00 PM',
      status: 'present'
    },
    {
      id: 'att-7',
      employeeId: 'emp-3',
      employeeName: 'মোঃ তানভীর আহমেদ',
      date: '2026-10-17',
      inTime: '09:00 AM',
      outTime: '05:00 PM',
      status: 'present'
    },
    {
      id: 'att-8',
      employeeId: 'emp-4',
      employeeName: 'মোঃ সুমন আলী',
      date: '2026-10-17',
      inTime: '-',
      outTime: '-',
      status: 'leave',
      remarks: 'নৈমিত্তিক ছুটি'
    }
  ],
  leaves: [
    {
      id: 'lev-1',
      employeeId: 'emp-4',
      employeeName: 'মোঃ সুমন আলী',
      leaveType: 'casual',
      startDate: '2026-10-17',
      endDate: '2026-10-17',
      totalDays: 1,
      reason: 'পারিবারিক জরুরি কাজ',
      status: 'approved',
      appliedDate: '2026-10-16',
      approvedBy: 'পরিচালক'
    },
    {
      id: 'lev-2',
      employeeId: 'emp-2',
      employeeName: 'মোছাঃ জান্নাতুল ফেরদৌস',
      leaveType: 'medical',
      startDate: '2026-10-04',
      endDate: '2026-10-05',
      totalDays: 2,
      reason: 'মৌসুমি জ্বর ও অসুস্থতা',
      status: 'approved',
      appliedDate: '2026-10-03',
      approvedBy: 'পরিচালক'
    }
  ],
  dailyAccounts: [
    {
      id: 'acc-1',
      year: 2026,
      month: 10,
      date: '2026-10-18',
      income: {
        khariz: 3200,
        chobi: 850,
        photocopy: 620,
        internet: 1400,
        others: 450,
        total: 6520,
        remarks: '৪টি নতুন খারিজ আবেদন, ২টি খতিয়ান উত্তোলন'
      },
      expense: {
        kagoj: 450,
        hardware: 0,
        dps: 500,
        dailyDeposit: 1500,
        advanceSalary: 0,
        others: 250,
        total: 2700,
        remarks: 'ফটোকপি পেপার ১ রিম ও নাস্তা খরচ'
      },
      remainingBalance: 3820,
      createdAt: '2026-10-18T17:00:00.000Z'
    },
    {
      id: 'acc-2',
      year: 2026,
      month: 10,
      date: '2026-10-17',
      income: {
        khariz: 2800,
        chobi: 700,
        photocopy: 800,
        internet: 1100,
        others: 300,
        total: 5700,
        remarks: '৩টি ই-নামজারি ফাইল সম্পাদন'
      },
      expense: {
        kagoj: 0,
        hardware: 600,
        dps: 500,
        dailyDeposit: 1200,
        advanceSalary: 500,
        others: 180,
        total: 2980,
        remarks: 'ক্যানন প্রিন্টার টোনার রিফিল'
      },
      remainingBalance: 2720,
      createdAt: '2026-10-17T17:00:00.000Z'
    },
    {
      id: 'acc-3',
      year: 2026,
      month: 10,
      date: '2026-10-16',
      income: {
        khariz: 4100,
        chobi: 950,
        photocopy: 750,
        internet: 1650,
        others: 500,
        total: 7950,
        remarks: 'ভূমি সেবা ক্যাম্পে বাড়তি সেবা প্রদান'
      },
      expense: {
        kagoj: 900,
        hardware: 0,
        dps: 500,
        dailyDeposit: 2000,
        advanceSalary: 0,
        others: 320,
        total: 3720,
        remarks: 'কাগজ ২ রিম ক্রয়'
      },
      remainingBalance: 4230,
      createdAt: '2026-10-16T17:00:00.000Z'
    },
    {
      id: 'acc-4',
      year: 2026,
      month: 10,
      date: '2026-10-15',
      income: {
        khariz: 2500,
        chobi: 600,
        photocopy: 550,
        internet: 900,
        others: 250,
        total: 4800
      },
      expense: {
        kagoj: 0,
        hardware: 350,
        dps: 500,
        dailyDeposit: 1000,
        advanceSalary: 0,
        others: 150,
        total: 2000
      },
      remainingBalance: 2800,
      createdAt: '2026-10-15T17:00:00.000Z'
    }
  ],
  salaryRecords: [
    {
      id: 'sal-1',
      employeeId: 'emp-1',
      employeeName: 'মোঃ রবিউল ইসলাম',
      employeeDesignation: 'উদ্যোক্তা ও পরিচালক',
      year: 2026,
      month: 9,
      earnings: {
        basic: 28000,
        medical: 2000,
        tiffin: 1500,
        transport: 1500,
        specialAllowance: 2000,
        totalEarnings: 35000
      },
      deductions: {
        advance: 0,
        revenueTax: 500,
        welfareFund: 300,
        deposit: 1200,
        totalDeductions: 2000
      },
      netPayable: 33000,
      paymentDate: '2026-10-02',
      paymentMethod: 'Bank',
      paymentStatus: 'Paid',
      remarks: 'সেপ্টেম্বর ২০২৬ মাসিক সম্মানী ও বেতন'
    },
    {
      id: 'sal-2',
      employeeId: 'emp-2',
      employeeName: 'মোছাঃ জান্নাতুল ফেরদৌস',
      employeeDesignation: 'সহকারী কম্পিউটার অপারেটর',
      year: 2026,
      month: 9,
      earnings: {
        basic: 16500,
        medical: 1500,
        tiffin: 1000,
        transport: 1000,
        specialAllowance: 1000,
        totalEarnings: 21000
      },
      deductions: {
        advance: 1000,
        revenueTax: 0,
        welfareFund: 200,
        deposit: 800,
        totalDeductions: 2000
      },
      netPayable: 19000,
      paymentDate: '2026-10-02',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      remarks: 'সেপ্টেম্বর ২০২৬ বেতন পরিশোধিত'
    },
    {
      id: 'sal-3',
      employeeId: 'emp-3',
      employeeName: 'মোঃ তানভীর আহমেদ',
      employeeDesignation: 'হিসাবরক্ষক ও কাস্টমার সার্ভিস',
      year: 2026,
      month: 9,
      earnings: {
        basic: 15000,
        medical: 1200,
        tiffin: 1000,
        transport: 800,
        specialAllowance: 500,
        totalEarnings: 18500
      },
      deductions: {
        advance: 500,
        revenueTax: 0,
        welfareFund: 200,
        deposit: 800,
        totalDeductions: 1500
      },
      netPayable: 17000,
      paymentDate: '2026-10-02',
      paymentMethod: 'Bank',
      paymentStatus: 'Paid'
    },
    {
      id: 'sal-4',
      employeeId: 'emp-4',
      employeeName: 'মোঃ সুমন আলী',
      employeeDesignation: 'অফিস সহকারী ও ডেলিভারি প্রতিনিধি',
      year: 2026,
      month: 9,
      earnings: {
        basic: 11000,
        medical: 800,
        tiffin: 800,
        transport: 600,
        specialAllowance: 300,
        totalEarnings: 13500
      },
      deductions: {
        advance: 0,
        revenueTax: 0,
        welfareFund: 100,
        deposit: 500,
        totalDeductions: 600
      },
      netPayable: 12900,
      paymentDate: '2026-10-02',
      paymentMethod: 'Cash',
      paymentStatus: 'Paid'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'জরুরি: নতুন ভূমি উন্নয়ন কর ও ই-নামজারি সার্কুলার',
      message: 'উপজেলা সহকারী কমিশনার (ভূমি) কার্যালয় হতে প্রেরিত নতুন সার্কুলার অনুযায়ী সকল নামজারি আবেদনের ক্ষেত্রে ওয়ারিশান সনদ ও খতিয়ানের মূল কপি যাচাই নিশ্চিত করুন।',
      type: 'urgent',
      date: '2026-10-18',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'মাসিক হিসাব-নিকাশ অডিট ও ক্লাউড ব্যাকআপ',
      message: 'চলতি মাসের হিসাব-নিকাশ শিট যাচাই সম্পন্ন হয়েছে। আজকের আয়-ব্যয় এন্ট্রি শেষে ক্লাউড সিঙ্ক বাটন চেপে ব্যাকআপ নিশ্চিত করুন।',
      type: 'info',
      date: '2026-10-17',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'কম্পিউটার হার্ডওয়্যার ও প্রিন্টার টোনার মজুদ',
      message: 'ফটোকপি পেপার এবং ক্যানন প্রিন্টারের কালো টোনার আগামী সপ্তাহে পুনরায় অর্ডার করতে হবে।',
      type: 'warning',
      date: '2026-10-15',
      isRead: true
    }
  ]
};
