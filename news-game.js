const edition = {
  date: "2026-11-06",
  stories: [
    {
      section: "Democracy",
      headline: "Voter rolls are being revised in six more states and Union Territories",
      before: "The Election Commission has started a voter-list revision in six more states and Union Territories. Eligible voters can add or correct their details before the",
      after: " are published.",
      answer: "updated voter lists",
      options: ["updated voter lists", "election results", "new constituency maps"],
      explanation: "The revision covers Arunachal Pradesh, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Mizoram, Odisha and Sikkim. It gives people a chance to check that their voter details are correct.",
      source: { label: "All India Radio · voter roll revision", url: "https://newsonair.gov.in/ec-announces-special-summary-revision-of-electoral-rolls-in-four-states-and-two-uts/" }
    },
    {
      section: "India & its neighbours",
      headline: "India offers help to Nepal after floods",
      before: "During talks in Kathmandu, India said it was ready to help Nepal repair infrastructure damaged by",
      after: ". The two sides also discussed energy ties.",
      answer: "floods",
      options: ["floods", "a power shortage", "an earthquake"],
      explanation: "The offer came as India and Nepal discussed cooperation ahead of Nepal’s prime minister’s expected visit to India. Roads and other infrastructure matter for trade and daily travel between the neighbours.",
      source: { label: "The Economic Times · India–Nepal talks", url: "https://economictimes.indiatimes.com/news/india/india-ready-to-help-nepal-rebuild-flood-hit-infra-deepen-energy-ties/articleshow/135584667.cms?from=mdr" }
    },
    {
      section: "Money & resources",
      headline: "India opens a new round of critical-mineral auctions",
      before: "The Ministry of Mines has put 20 critical-mineral blocks up for auction. A block is a mapped area where surveys suggest a mineral deposit may be present. The same announcement also opened bidding for 11 exploration licences. Unlike a mining licence, an exploration licence lets a company",
      after: ".",
      answer: "look for mineral deposits before mining begins",
      options: ["look for mineral deposits before mining begins", "start selling finished batteries", "set prices for imported minerals"],
      explanation: "A mineral block is a defined area offered to companies under set rules. Depending on the auction, a company can get permission to explore the area or to mine it. These minerals are called critical because several industries rely on them, including clean energy, electronics and electric vehicles.",
      source: { label: "Ministry of Mines · 20 block and 11 exploration-licence auctions", url: "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2333123&lang=2&reg=48" }
    },
    {
      section: "How Parliament works",
      headline: "Hardeep Singh Puri elected unopposed to a Rajya Sabha seat",
      before: "Hardeep Singh Puri was elected unopposed to a Rajya Sabha seat from Madhya Pradesh. For this kind of state seat, the voters are",
      after: ".",
      answer: "elected members of the state Assembly",
      options: ["elected members of the state Assembly", "all residents in a direct public vote", "members of the Lok Sabha"],
      explanation: "Rajya Sabha members representing a state are elected by that state’s elected MLAs. Puri was the only candidate left after the other nominations were rejected.",
      source: { label: "The Indian Express · Rajya Sabha election", url: "https://indianexpress.com/article/india/hardeep-singh-puri-elected-unopposed-rajya-sabha-madhya-pradesh-10952368/" }
    },
    {
      section: "Everyday India",
      headline: "New Delhi railway station plans separate routes for passengers",
      before: "New Delhi railway station is setting up separate entry and exit routes for reserved and unreserved passengers to help manage",
      after: ".",
      answer: "festival crowds",
      options: ["festival crowds", "a new metro line", "freight trains"],
      explanation: "The change is intended to make passenger movement easier during the busy Diwali and Chhath travel period. Separate routes can help reduce bottlenecks at the station.",
      source: { label: "The Indian Express · New Delhi station arrangements", url: "https://indianexpress.com/article/india/new-delhi-railway-station-separate-entry-exit-gates-diwali-chhath-puja-10952299/" }
    }
  ]
};


const app = document.querySelector("#app");
const savedKey = "explain-that-india-daily-v1";
const progressKey = "explain-that-india-streak-v1";
const today = edition.date;
const blankState = () => ({ index: 0, answers: [], revealed: false, score: 0, finished: false });
