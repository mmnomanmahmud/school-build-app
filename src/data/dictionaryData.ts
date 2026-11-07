export interface DictionaryWord {
  id: string;
  word: string;
  englishWord: string;
  pronunciation: string;
  partOfSpeech: string;
  category: 'science' | 'math' | 'literature' | 'grammar' | 'english' | 'general';
  categoryName: string;
  banglaMeaning: string;
  englishMeaning: string;
  detailedExplanation: string;
  synonyms: string[];
  antonyms: string[];
  exampleBangla: string;
  exampleEnglish: string;
}

export const DICTIONARY_DATABASE: DictionaryWord[] = [
  // ==================== বিজ্ঞান ও প্রযুক্তি ====================
  {
    id: 'dict-photosynthesis',
    word: 'সালোকসংশ্লেষণ',
    englishWord: 'Photosynthesis',
    pronunciation: 'শা-লোক-শং-শ্লে-শোন / ˌfoʊtoʊˈsɪnθəsɪs',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'science',
    categoryName: 'বিজ্ঞান ও প্রযুক্তি',
    banglaMeaning: 'সূর্যালোকের উপস্থিতিতে সবুজ উদ্ভিদের শর্করা জাতীয় খাদ্য তৈরির জৈব-রাসায়নিক প্রক্রিয়া।',
    englishMeaning: 'The biological process by which green plants and certain organisms use sunlight to synthesize nutrients from CO2 and water.',
    detailedExplanation: 'গাছের পাতার ক্লোরোফিল সূর্যের আলোকশক্তি শোষণ করে বাতাস থেকে নেওয়া কার্বন ডাই-অক্সাইড এবং মূল দিয়ে শোষিত পানির বিক্রিয়ায় গ্লুকোজ তৈরি করে এবং পরিবেশে অক্সিজেন গ্যাস নির্গমন করে। পৃথিবীতে প্রাণিজগতের বেঁচে থাকার এটিই মূল ভিত্তি।',
    synonyms: ['আলোক সংশ্লেষ', 'উদ্ভিদের খাদ্য প্রস্তুতি', 'হালোক সংশ্লেষণ'],
    antonyms: ['শ্বসন (Respiration)', 'অন্ধকার দহন'],
    exampleBangla: 'সালোকসংশ্লেষণ প্রক্রিয়ার মাধ্যমেই পৃথিবীর সকল প্রাণী অক্সিজেনের জোগান পায়।',
    exampleEnglish: 'Photosynthesis is essential for life on Earth as it produces oxygen and food for living organisms.'
  },
  {
    id: 'dict-gravitation',
    word: 'মহাকর্ষ',
    englishWord: 'Gravitation / Gravity',
    pronunciation: 'মো-হা-কর-শো / ˌɡrævɪˈteɪʃn',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'science',
    categoryName: 'বিজ্ঞান ও প্রযুক্তি',
    banglaMeaning: 'মহাবিশ্বের যেকোনো দুটি বস্তুকণার মধ্যকার পারস্পরিক আকর্ষণ বল।',
    englishMeaning: 'The fundamental force of attraction between all matter in the universe, proportional to mass.',
    detailedExplanation: '১৬৮৭ সালে স্যার আইজ্যাক নিউটন এই মহাকর্ষ সূত্র আবিষ্কার করেন। মহাবিশ্বের প্রতিটি বস্তু অন্য বস্তুকে নিজের দিকে টানছে। পৃথিবী ও সূর্যের মধ্যকার এই আকর্ষণ বলের কারণেই গ্রহগুলো সূর্যের চারদিকে নির্দিষ্ট কক্ষপথে ঘোরে।',
    synonyms: ['মাধ্যাকর্ষণ', 'আকর্ষণ বল', 'গুরুত্বাকর্ষণ'],
    antonyms: ['বিকর্ষণ (Repulsion)', 'লেভিটেশন'],
    exampleBangla: 'মহাকর্ষ বলের প্রভাবেই পৃথিবী সূর্যের চারপাশে নিয়মিত আবর্তন করে।',
    exampleEnglish: 'Gravitation holds the planets in their orbits around the Sun.'
  },
  {
    id: 'dict-ecosystem',
    word: 'বাস্তুতন্ত্র',
    englishWord: 'Ecosystem',
    pronunciation: 'বাশ-তু-তন-ত্রো / ˈiːkoʊsɪstəm',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'science',
    categoryName: 'বিজ্ঞান ও প্রযুক্তি',
    banglaMeaning: 'একটি নির্দিষ্ট অঞ্চলে বসবাসকারী জীব ও জড় পরিবেশের পারস্পরিক মিথস্ক্রিয়া ও সম্পর্কের ব্যবস্থা।',
    englishMeaning: 'A biological community of interacting organisms and their physical environment.',
    detailedExplanation: 'একটি পুকুর বা সুন্দরবনের বনাঞ্চল হলো বাস্তুতন্ত্রের চমৎকার উদাহরণ। এখানে উৎপাদক (উদ্ভিদ), খাদক (কীটপতঙ্গ, মাছ, বাঘ) এবং বিয়োজক (ব্যাকটেরিয়া) একে অপরের ওপর নির্ভরশীল হয়ে পরিবেশের ভারসাম্য রক্ষা করে।',
    synonyms: ['বাস্তুসংস্থান', 'পরিবেশ ব্যবস্থা', 'বাস্তুবিদ্যা'],
    antonyms: ['বিচ্ছিন্ন পরিবেশ', 'কৃত্রিম শূন্যতা'],
    exampleBangla: 'সুন্দরবনের বাস্তুতন্ত্র রক্ষার ওপর উপকূলীয় অঞ্চলের নিরাপত্তা অনেকাংশে নির্ভরশীল।',
    exampleEnglish: 'Protecting the forest ecosystem is crucial for preserving biodiversity.'
  },
  {
    id: 'dict-algorithm',
    word: 'অ্যালগরিদম',
    englishWord: 'Algorithm',
    pronunciation: 'অ্যাল-গো-রি-দম / ˈælɡərɪðəm',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'science',
    categoryName: 'বিজ্ঞান ও প্রযুক্তি',
    banglaMeaning: 'কোনো নির্দিষ্ট সমস্যা সমাধানের জন্য ধাপে ধাপে সুনির্দিষ্ট নিয়মের সমষ্টি।',
    englishMeaning: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.',
    detailedExplanation: '৯ম শতাব্দীর বিখ্যাত গণিতবিদ আল-খোয়ারিজমির নাম থেকে এই শব্দের উৎপত্তি। কম্পিউটার প্রোগ্রামিং, গুগল সার্চ ইঞ্জিন এবং কৃত্রিম বুদ্ধিমত্তা (AI) অ্যালগরিদমের যৌক্তিক ধাপ অনুসরণ করে কাজ করে।',
    synonyms: ['পদ্ধতিমালা', 'সমাধানের ধাপ', 'যৌক্তিক কর্মপদ্ধতি'],
    antonyms: ['এলোমেলো কাজ (Chaos)', 'বিশৃঙ্খলতা'],
    exampleBangla: 'কম্পিউটার দ্রুততম সময়ে সঠিক তথ্য খুঁজে দিতে সার্চ অ্যালগরিদম ব্যবহার করে।',
    exampleEnglish: 'The recommendation algorithm helps users find relevant educational books.'
  },
  {
    id: 'dict-refraction',
    word: 'প্রতিসরণ',
    englishWord: 'Refraction',
    pronunciation: 'প্রো-তি-শো-রোন / rɪˈfrækʃn',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'science',
    categoryName: 'বিজ্ঞান ও প্রযুক্তি',
    banglaMeaning: 'এক স্বচ্ছ মাধ্যম থেকে অন্য স্বচ্ছ মাধ্যমে আলো তির্যকভাবে প্রবেশের সময় দিক পরিবর্তনের ঘটনা।',
    englishMeaning: 'The change in direction of a wave passing from one medium to another caused by its change in speed.',
    detailedExplanation: 'পানিতে একটি সোজা পেন্সিল ডোবালে আলোর প্রতিসরণের কারণে পেন্সিলটিকে বাঁকা দেখায়। চশমার লেন্স এবং ক্যামেরার কার্যপদ্ধতি আলোর প্রতিসরণ নিয়মের ওপর প্রতিষ্ঠিত।',
    synonyms: ['আলোর বক্রতা', 'দিকবদল', 'তরঙ্গ বাঁকা হওয়া'],
    antonyms: ['প্রতিফলন (Reflection)', 'সরলরেখায় গমন'],
    exampleBangla: 'আলোর প্রতিসরণের কারণেই কাচের গ্লাসের ভেতরে রাখা কাঠিটি বাঁকা দেখায়।',
    exampleEnglish: 'Refraction of light creates the illusion of a bent stick inside water.'
  },

  // ==================== গণিত ও পরিমাপ ====================
  {
    id: 'dict-equation',
    word: 'সমীকরণ',
    englishWord: 'Equation',
    pronunciation: 'শো-মি-কো-রোন / ɪˈkweɪʒn',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'math',
    categoryName: 'গণিত ও যুক্তিবিদ্যা',
    banglaMeaning: 'সমান চিহ্নের সাহায্যে দুই বা ততোধিক গাণিতিক রাশির সমতা প্রকাশের রূপ।',
    englishMeaning: 'A mathematical statement that asserts the equality of two expressions.',
    detailedExplanation: 'সমীকরণে সাধারণত অজ্ঞাত চলক (যেমন: x, y) থাকে যার মান বের করা হয়। উদাহরণস্বরূপ, 2x + 4 = 10 একটি একঘাত সমীকরণ, যার সমাধান x = 3।',
    synonyms: ['গাণিতিক সমতা', 'রাশিমালা সাম্য'],
    antonyms: ['অসমতা (Inequality)'],
    exampleBangla: 'চলকের মান নির্ণয় করতে বীজগণিতীয় সমীকরণের উভয় পাশে একই সংখ্যা যোগ বা বিয়োগ করা হয়।',
    exampleEnglish: 'Solving the quadratic equation gave two distinct real roots.'
  },
  {
    id: 'dict-prime-number',
    word: 'মৌলিক সংখ্যা',
    englishWord: 'Prime Number',
    pronunciation: 'মৌ-লিক শং-খ্যা / praɪm ˈnʌmbər',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'math',
    categoryName: 'গণিত ও যুক্তিবিদ্যা',
    banglaMeaning: '১ অপেক্ষা বড় যেসব পূর্ণসংখ্যাকে কেবল ১ এবং সেই সংখ্যা ছাড়া অন্য কিছু দিয়ে নিঃশেষে ভাগ করা যায় না।',
    englishMeaning: 'A whole number greater than 1 that cannot be formed by multiplying two smaller natural numbers.',
    detailedExplanation: '২, ৩, ৫, ৭, ১১, ১৩, ১৭ ইত্যাদি মৌলিক সংখ্যা। ২ হলো একমাত্র জোড় মৌলিক সংখ্যা। কম্পিউটার সাইবার নিরাপত্তায় ক্রিপ্টোগ্রাফি বা পাসওয়ার্ড এনক্রিপশনে বিশাল মৌলিক সংখ্যা ব্যবহার করা হয়।',
    synonyms: ['অবিভাজ্য সংখ্যা', 'আদিম সংখ্যা'],
    antonyms: ['যৌগিক সংখ্যা (Composite Number)'],
    exampleBangla: '১ থেকে ১০০ এর মধ্যে মোট ২৫টি মৌলিক সংখ্যা রয়েছে।',
    exampleEnglish: 'Two is the only even prime number in mathematics.'
  },
  {
    id: 'dict-probability',
    word: 'সম্ভাবনা',
    englishWord: 'Probability',
    pronunciation: 'শম-ভা-বো-না / ˌprɑːbəˈbɪləti',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'math',
    categoryName: 'গণিত ও যুক্তিবিদ্যা',
    banglaMeaning: 'কোনো ঘটনা ঘটা বা না ঘটার গাণিতিক পরিমাপ বা সম্ভাবনা অনুপাত (০ থেকে ১ পর্যন্ত)।',
    englishMeaning: 'The extent to which an event is likely to occur, measured by the ratio of favorable cases to total possibilities.',
    detailedExplanation: 'একটি মুদ্রা টস করলে হেড পড়ার সম্ভাবনা ১/২ বা ৫০%। আবহাওয়ার পূর্বাভাস, শেয়ার বাজার ও বিজ্ঞানের গবেষণায় সম্ভাব্যতা তত্ত্ব অত্যন্ত গুরুত্বপূর্ণ।',
    synonyms: ['সম্ভাব্যতা', 'সম্ভাবনামান', 'ঘটনার সম্ভাবনা'],
    antonyms: ['নিশ্চয়তা (Certainty)', 'অসম্ভবতা (Impossibility)'],
    exampleBangla: 'আজ আকাশে মেঘ থাকা সত্ত্বেও বৃষ্টি হওয়ার সম্ভাবনা শতকরা চল্লিশ ভাগ।',
    exampleEnglish: 'The probability of rolling a six on a standard die is one in six.'
  },

  // ==================== সাহিত্য ও ব্যাকরণ ====================
  {
    id: 'dict-metaphor',
    word: 'রূপক অলঙ্কার',
    englishWord: 'Metaphor',
    pronunciation: 'রু-পোক অলং-কার / ˈmetəfɔːr',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'literature',
    categoryName: 'সাহিত্য ও ব্যাকরণ',
    banglaMeaning: 'উপমেয় ও উপমানের মধ্যে অভেদ কল্পনা করে এক বস্তুর বৈশিষ্ট্য অন্য বস্তুর ওপর সরাসরি আরোপ করা।',
    englishMeaning: 'A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable.',
    detailedExplanation: 'উপমা দিতে যখন "মতো" বা "যেন" শব্দ বাদ দিয়ে সরাসরি এক করে দেওয়া হয়, তখন তাকে রূপক বলে। যেমন: "মনমাঝি", "বিষাদসিন্ধু", "জীবন একটি রঙ্গমঞ্চ"।',
    synonyms: ['রূপক ধর্মী উপমা', 'লাক্ষণিক প্রয়োগ'],
    antonyms: ['আক্ষরিক অর্থ (Literal meaning)'],
    exampleBangla: 'কবি মানুষের ক্ষণস্থায়ী জীবনকে "পদ্মাপাতার জল" এর রূপক হিসেবে তুলে ধরেছেন।',
    exampleEnglish: 'The phrase "the classroom was a zoo" is a well-known metaphor.'
  },
  {
    id: 'dict-surrealism',
    word: 'পরাবাস্তবতা',
    englishWord: 'Surrealism',
    pronunciation: 'পো-রা-বাশ-তব-তা / səˈriːəlɪzəm',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'literature',
    categoryName: 'সাহিত্য ও ব্যাকরণ',
    banglaMeaning: 'বাস্তব জীবনের যুক্তি ছাড়িয়ে মানুষের অবচেতন মন ও স্বপ্নের অদ্ভুত জগতের সাহিত্যিক বা শৈল্পিক প্রকাশ।',
    englishMeaning: 'A 20th-century avant-garde movement in art and literature that sought to release the creative potential of the unconscious mind.',
    detailedExplanation: 'জীবনানন্দ দাশের কবিতা এবং সালভাদর দালির চিত্রকর্মে পরাবাস্তবতার তীব্র উপস্থিতি লক্ষ্য করা যায়। এটি যুক্তিযুক্ত বাস্তবতার শৃঙ্খল ভেঙে মানুষের স্বপ্নের অবাধ স্বাধীনতাকে ফুটিয়ে তোলে।',
    synonyms: ['অতিবাস্তবতা', 'স্বপ্নের জগত', 'অধিবাস্তব'],
    antonyms: ['নগ্ন বাস্তবতা (Realism)', 'প্রাকৃতিক অনুকরণ'],
    exampleBangla: 'জীবনানন্দ দাশের রূপসী বাংলার কবিতায় পরাবাস্তবতার নিপুণ স্পর্শ বিদ্যমান।',
    exampleEnglish: 'Surrealism blurs the line between dreams and ordinary reality.'
  },
  {
    id: 'dict-samas',
    word: 'সমাস',
    englishWord: 'Compound Words / Synthesis',
    pronunciation: 'শো-মাশ / ˈkɒmpaʊnd',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'grammar',
    categoryName: 'সাহিত্য ও ব্যাকরণ',
    banglaMeaning: 'পরস্পর অর্থসঙ্গতিপূর্ণ একাধিক পদকে এক পদে পরিণত করার ব্যাকরণগত নিয়ম।',
    englishMeaning: 'The grammatical process of combining multiple related words into a single concise compound word.',
    detailedExplanation: 'সমাস শব্দের অর্থ সংক্ষেপ, মিলন বা একাধিক পদের একপদীকরণ। সমাস মূলত ৬ প্রকার: দ্বন্দ্ব, দ্বিগু, কর্মধারয়, তৎপুরুষ, বহুব্রীহি ও অব্যয়ীভাব। যেমন: সিংহাসন = সিংহ চিহ্নিত যে আসন।',
    synonyms: ['সংক্ষেপীকরণ', 'একপদীকরণ', 'শব্দ সংমিশ্রণ'],
    antonyms: ['ব্যাসবাক্য বিস্তার', 'বিচ্ছিন্নকরণ'],
    exampleBangla: 'বাংলা ভাষায় নতুন অর্থবোধক শব্দ গঠনের ক্ষেত্রে সমাস এক অনন্য ভূমিকা পালন করে।',
    exampleEnglish: 'Compound words in grammar help express complex concepts concisely.'
  },

  // ==================== ইংরেজি ও উচ্চশিক্ষা শব্দভাণ্ডার ====================
  {
    id: 'dict-resilience',
    word: 'স্থিতিস্থাপকতা / অদম্য প্রতিরোধ ক্ষমতা',
    englishWord: 'Resilience',
    pronunciation: 'রে-জি-লি-য়েন্স / rɪˈzɪliəns',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'english',
    categoryName: 'ইংরেজি ও উচ্চশিক্ষা',
    banglaMeaning: 'কঠিন আঘাত বা বিপর্যয় থেকে দ্রুত পূর্বাবস্থায় ফিরে আসার মানসিক বা শারীরিক ক্ষমতা।',
    englishMeaning: 'The capacity to recover quickly from difficulties; toughness and mental strength.',
    detailedExplanation: 'ব্যর্থতা বা দুর্যোগের মুখে হাল না ছেড়ে ইতিবাচক মানসিকতা নিয়ে পুনরায় ঘুরে দাঁড়ানোর গুণকেই রেসিলিয়েন্স বলা হয়। সফল শিক্ষার্থী ও বিজ্ঞানীদের এটি একটি প্রধান বৈশিষ্ট্য।',
    synonyms: ['দৃঢ়তা', 'অপরাজেয় শক্তি', 'সহনশীলতা', 'Endurance', 'Grit'],
    antonyms: ['ভঙ্গুরতা (Fragility)', 'দুর্বলতা (Vulnerability)'],
    exampleBangla: 'বাঙালী জাতি বারবার প্রাকৃতিক দুর্যোগ ও সংকট কাটিয়ে অনন্য স্থিতিস্থাপকতা প্রদর্শন করেছে।',
    exampleEnglish: 'Mental resilience helps students overcome academic pressure and setbacks.'
  },
  {
    id: 'dict-paradigm',
    word: 'দৃষ্টান্ত / মূল কাঠামো',
    englishWord: 'Paradigm',
    pronunciation: 'প্যারা-ডাইম / ˈpærədaɪm',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'english',
    categoryName: 'ইংরেজি ও উচ্চশিক্ষা',
    banglaMeaning: 'কোনো বিষয়ের মূল ধারণা, চিন্তা-পদ্ধতি বা প্রতিষ্ঠিত আদর্শ রূপরেখা।',
    englishMeaning: 'A typical example, pattern, or overarching framework of ideas and theories.',
    detailedExplanation: 'যখন সমাজে কোনো বৈপ্লবিক পরিবর্তন আসে (যেমন ইন্টারনেটের আবির্ভাব), তখন একে বলে "প্যারাডাইম শিফট" (Paradigm Shift) অর্থাৎ চিন্তা ও কাজের ধরনে মৌলিক রূপান্তর।',
    synonyms: ['আদর্শ নমুনা', 'মডেল', 'কাঠামো', 'Archetype', 'Framework'],
    antonyms: ['ব্যতিক্রম (Anomaly)', 'অনিয়ম'],
    exampleBangla: 'অনলাইন লাইব্রেরির বিকাশ শিক্ষার জগতে এক নতুন প্যারাডাইম বা রূপরেখা তৈরি করেছে।',
    exampleEnglish: 'The digital revolution created a paradigm shift in how students read textbooks.'
  },
  {
    id: 'dict-ubiquitous',
    word: 'সর্বব্যাপী / সর্বত্র বিরাজমান',
    englishWord: 'Ubiquitous',
    pronunciation: 'ইউ-বি-কুই-টাস / juːˈbɪkwɪtəs',
    partOfSpeech: 'বিশেষণ (Adjective)',
    category: 'english',
    categoryName: 'ইংরেজি ও উচ্চশিক্ষা',
    banglaMeaning: 'যা একই সাথে সব স্থানে বর্তমান বা সর্বত্র সহজে চোখে পড়ে।',
    englishMeaning: 'Present, appearing, or found everywhere at the same time.',
    detailedExplanation: 'আধুনিক যুগে মোবাইল ফোন ও ইন্টারনেট সারা পৃথিবীতে এত বিস্তার লাভ করেছে যে এদেরকে "Ubiquitous Technology" বলা হয়।',
    synonyms: ['সর্বত্রগামী', 'ব্যাপক', 'Omnipresent', 'Pervasive'],
    antonyms: ['বিরল (Rare)', 'দুষ্প্রাপ্য (Scarce)'],
    exampleBangla: 'বর্তমানে স্মার্টফোন মানুষের প্রাত্যহিক জীবনে এক সর্বব্যাপী উপাদানে পরিণত হয়েছে।',
    exampleEnglish: 'Smartphones have become ubiquitous in modern society.'
  },
  {
    id: 'dict-empirical',
    word: 'অভিজ্ঞতালব্ধ / পরীক্ষালব্ধ',
    englishWord: 'Empirical',
    pronunciation: 'এম-পিরি-কাল / ɪmˈpɪrɪkl',
    partOfSpeech: 'বিশেষণ (Adjective)',
    category: 'english',
    categoryName: 'ইংরেজি ও উচ্চশিক্ষা',
    banglaMeaning: 'কেবল তত্ত্ব বা অনুমানের ওপর নির্ভর না করে বাস্তব পর্যবেক্ষণ ও পরীক্ষার মাধ্যমে প্রমাণিত।',
    englishMeaning: 'Based on, concerned with, or verifiable by observation or experiment rather than purely theory or logic.',
    detailedExplanation: 'বিজ্ঞান সর্বদা এমপিরিক্যাল প্রমাণের ওপর দাঁড়ায়। কোনো দাবি সত্য হতে হলে তা পরীক্ষার মাধ্যমে ল্যাবরেটরিতে প্রমাণিত হতে হয়।',
    synonyms: ['পরীক্ষামূলক', 'বাস্তবধর্মী', 'Evidence-based', 'Observational'],
    antonyms: ['তাত্ত্বিক (Theoretical)', 'কাল্পনিক (Hypothetical)'],
    exampleBangla: 'বিজ্ঞানীরা ওষুধটির কার্যকারিতা সম্পর্কে পর্যাপ্ত অভিজ্ঞতালব্ধ প্রমাণ সংগ্রহ করেছেন।',
    exampleEnglish: 'There is strong empirical evidence supporting the theory of climate change.'
  },
  {
    id: 'dict-pragmatic',
    word: 'বাস্তববাদী / প্রয়োগমুখী',
    englishWord: 'Pragmatic',
    pronunciation: 'প্র্যাগ-ম্যাটিক / præɡˈmætɪk',
    partOfSpeech: 'বিশেষণ (Adjective)',
    category: 'english',
    categoryName: 'ইংরেজি ও উচ্চশিক্ষা',
    banglaMeaning: 'কল্পনাবিলাসী না হয়ে ব্যবহারিক ও বাস্তব সমাধানের দিকে মনোনিবেশকারী।',
    englishMeaning: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    detailedExplanation: 'পড়াশোনায় শুধু পরিকল্পনা না করে প্রতিদিন সময়মতো পড়তে বসা হলো একজন প্র্যাগম্যাটিক শিক্ষার্থীর আচরণ। এটি আদর্শের চেয়ে কার্যকর ফলাফলের ওপর জোর দেয়।',
    synonyms: ['বাস্তবনিষ্ঠ', 'কাজের মানুষ', 'Practical', 'Realistic'],
    antonyms: ['ভাববিলাসী (Idealistic)', 'অবাস্তব (Impractical)'],
    exampleBangla: 'কঠিন পরিস্থিতিতে আবেগ পরিহার করে বাস্তবমুখী সিদ্ধান্ত নেওয়াই বুদ্ধিমানের কাজ।',
    exampleEnglish: 'We need to take a pragmatic approach to solve this educational issue.'
  },

  // ==================== ইতিহাস ও সমাজবিজ্ঞান ====================
  {
    id: 'dict-sovereignty',
    word: 'সার্বভৌমত্ব',
    englishWord: 'Sovereignty',
    pronunciation: 'শার-বো-ভৌ-মোত-তো / ˈsɑːvrənti',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'general',
    categoryName: 'ইতিহাস ও সমাজ',
    banglaMeaning: 'একটি স্বাধীন রাষ্ট্রের সর্বোচ্চ, চূড়ান্ত ও নিরঙ্কুশ শাসনক্ষমতা।',
    englishMeaning: 'The supreme authority and absolute power of a state to govern itself without external interference.',
    detailedExplanation: 'সার্বভৌমত্ব রাষ্ট্রের অন্যতম প্রধান মৌলিক উপাদান। এর অর্থ অভ্যন্তরীণভাবে রাষ্ট্রের সীমানার মধ্যে এর আইন সর্বেসর্বা এবং আন্তর্জাতিক ক্ষেত্রে কোনো বিদেশি শক্তি দ্বারা রাষ্ট্রটি পদানত নয়। ১৯৭১ সালে লাখো শহীদের রক্তের বিনিময়ে বাংলাদেশ তার সার্বভৌমত্ব অর্জন করে।',
    synonyms: ['সর্বোচ্চ রাষ্ট্রক্ষমতা', 'স্বাধীন স্বাধিকার', 'Supreme power'],
    antonyms: ['পরাধীনতা (Subjection)', 'উপনিবেশিক শাসন'],
    exampleBangla: 'দেশের স্বাধীনতা ও সার্বভৌমত্ব রক্ষা করা প্রত্যেক নাগরিকের পবিত্র দায়িত্ব।',
    exampleEnglish: 'Defending national sovereignty is the primary constitutional duty of every citizen.'
  },
  {
    id: 'dict-archaeology',
    word: 'প্রত্নতত্ত্ব',
    englishWord: 'Archaeology',
    pronunciation: 'প্রত-নো-তত-তো / ˌɑːrkiˈɑːlədʒi',
    partOfSpeech: 'বিশেষ্য (Noun)',
    category: 'general',
    categoryName: 'ইতিহাস ও সমাজ',
    banglaMeaning: 'মাটি খুঁড়ে প্রাপ্ত প্রাচীন ধ্বংসাবশেষ ও বস্তু বিশ্লেষণ করে অতীত মানবসভ্যতা ও ইতিহাস জানার বিজ্ঞান।',
    englishMeaning: 'The study of human history and prehistory through the excavation of sites and the analysis of artifacts.',
    detailedExplanation: 'বাংলাদেশের মহাস্থানগড়, উয়ারী-বটেশ্বর ও পাহাড়পুর বৌদ্ধবিহারের প্রত্নতাত্ত্বিক খননকাজ প্রমাণ করে হাজার বছর পূর্বে বাংলায় উন্নত নগর ও বাণিজ্য সভ্যতা গড়ে উঠেছিল।',
    synonyms: ['পুরাতত্ত্ব', 'প্রাচীন ধ্বংসাবশেষ বিদ্যা'],
    antonyms: ['ভবিষ্যদ্বাণী (Futurism)'],
    exampleBangla: 'উয়ারী-বটেশ্বরের প্রত্নতাত্ত্বিক আবিষ্কার প্রাচীন বাংলার আড়াই হাজার বছরের ঐতিহ্য উন্মোচন করেছে।',
    exampleEnglish: 'Archaeology provides tangible clues about ancient human civilizations.'
  }
];
