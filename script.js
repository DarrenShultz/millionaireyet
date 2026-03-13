// Configuration
const API_KEY = "7de4a08ab9487b4483480368";
const CACHE_KEY = "millionaire_rates";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Currency display names
const CURRENCY_NAMES = {
    USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
    AUD: "Australian Dollar", CAD: "Canadian Dollar", CHF: "Swiss Franc",
    CNY: "Chinese Yuan", INR: "Indian Rupee", MXN: "Mexican Peso",
    BRL: "Brazilian Real", KRW: "South Korean Won", TRY: "Turkish Lira",
    RUB: "Russian Ruble", ZAR: "South African Rand", SEK: "Swedish Krona",
    NOK: "Norwegian Krone", DKK: "Danish Krone", PLN: "Polish Zloty",
    THB: "Thai Baht", IDR: "Indonesian Rupiah", HUF: "Hungarian Forint",
    CZK: "Czech Koruna", ILS: "Israeli Shekel", CLP: "Chilean Peso",
    PHP: "Philippine Peso", AED: "UAE Dirham", COP: "Colombian Peso",
    SAR: "Saudi Riyal", MYR: "Malaysian Ringgit", SGD: "Singapore Dollar",
    RON: "Romanian Leu", NGN: "Nigerian Naira", EGP: "Egyptian Pound",
    VND: "Vietnamese Dong", PKR: "Pakistani Rupee", BDT: "Bangladeshi Taka",
    ARS: "Argentine Peso", UAH: "Ukrainian Hryvnia", PEN: "Peruvian Sol",
    KES: "Kenyan Shilling", GHS: "Ghanaian Cedi", LKR: "Sri Lankan Rupee",
    MMK: "Myanmar Kyat", UZS: "Uzbekistani Som", KZT: "Kazakhstani Tenge",
    TWD: "Taiwan Dollar", HKD: "Hong Kong Dollar", NZD: "New Zealand Dollar",
    ISK: "Icelandic Krona", BGN: "Bulgarian Lev", HRK: "Croatian Kuna",
    GEL: "Georgian Lari", JOD: "Jordanian Dinar", KWD: "Kuwaiti Dinar",
    BHD: "Bahraini Dinar", OMR: "Omani Rial", QAR: "Qatari Riyal",
    LBP: "Lebanese Pound", DZD: "Algerian Dinar", MAD: "Moroccan Dirham",
    TND: "Tunisian Dinar", IQD: "Iraqi Dinar", SYP: "Syrian Pound",
    LAK: "Lao Kip", KHR: "Cambodian Riel", NPR: "Nepalese Rupee",
    AFN: "Afghan Afghani", ALL: "Albanian Lek", AMD: "Armenian Dram",
    AOA: "Angolan Kwanza", AWG: "Aruban Florin", AZN: "Azerbaijani Manat",
    BAM: "Bosnian Mark", BBD: "Barbadian Dollar", BIF: "Burundian Franc",
    BMD: "Bermudian Dollar", BND: "Brunei Dollar", BOB: "Bolivian Boliviano",
    BSD: "Bahamian Dollar", BTN: "Bhutanese Ngultrum", BWP: "Botswana Pula",
    BYN: "Belarusian Ruble", BZD: "Belize Dollar", CDF: "Congolese Franc",
    CRC: "Costa Rican Colon", CUP: "Cuban Peso", CVE: "Cape Verdean Escudo",
    DJF: "Djiboutian Franc", DOP: "Dominican Peso", ERN: "Eritrean Nakfa",
    ETB: "Ethiopian Birr", FJD: "Fijian Dollar", FKP: "Falkland Pound",
    FOK: "Faroese Krona", GIP: "Gibraltar Pound", GMD: "Gambian Dalasi",
    GNF: "Guinean Franc", GTQ: "Guatemalan Quetzal", GYD: "Guyanese Dollar",
    HNL: "Honduran Lempira", HTG: "Haitian Gourde", JMD: "Jamaican Dollar",
    KGS: "Kyrgyzstani Som", KID: "Kiribati Dollar", KMF: "Comorian Franc",
    KYD: "Cayman Dollar", LSL: "Lesotho Loti", LRD: "Liberian Dollar",
    LYD: "Libyan Dinar", MDL: "Moldovan Leu", MGA: "Malagasy Ariary",
    MKD: "Macedonian Denar", MNT: "Mongolian Tugrik", MOP: "Macanese Pataca",
    MRU: "Mauritanian Ouguiya", MUR: "Mauritian Rupee", MVR: "Maldivian Rufiyaa",
    MWK: "Malawian Kwacha", MZN: "Mozambican Metical", NAD: "Namibian Dollar",
    NIO: "Nicaraguan Cordoba", PAB: "Panamanian Balboa", PGK: "Papua New Guinean Kina",
    PYG: "Paraguayan Guarani", RSD: "Serbian Dinar", RWF: "Rwandan Franc",
    SBD: "Solomon Islands Dollar", SCR: "Seychellois Rupee", SDG: "Sudanese Pound",
    SHP: "Saint Helena Pound", SLE: "Sierra Leonean Leone", SOS: "Somali Shilling",
    SRD: "Surinamese Dollar", SSP: "South Sudanese Pound", STN: "Sao Tome Dobra",
    SVC: "Salvadoran Colon", SZL: "Eswatini Lilangeni", TJS: "Tajikistani Somoni",
    TMT: "Turkmen Manat", TOP: "Tongan Paanga", TTD: "Trinidad Dollar",
    TVD: "Tuvaluan Dollar", TZS: "Tanzanian Shilling", UGX: "Ugandan Shilling",
    UYU: "Uruguayan Peso", VES: "Venezuelan Bolivar", VUV: "Vanuatu Vatu",
    WST: "Samoan Tala", XAF: "Central African CFA Franc", XCD: "East Caribbean Dollar",
    XDR: "Special Drawing Rights", XOF: "West African CFA Franc", XPF: "CFP Franc",
    YER: "Yemeni Rial", ZMW: "Zambian Kwacha", ZWL: "Zimbabwean Dollar"
};

function getCachedRates() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    if (age > CACHE_DURATION) return null;
    return data.rates;
}

function cacheRates(rates) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        rates: rates
    }));
}

async function fetchRates() {
    const cached = getCachedRates();
    if (cached) return cached;

    const url = "https://v6.exchangerate-api.com/v6/" + API_KEY + "/latest/USD";
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== "success") {
        throw new Error("API Error: " + (data["error-type"] || "Unknown error"));
    }

    cacheRates(data.conversion_rates);
    return data.conversion_rates;
}

function parseNetWorth(input) {
    const cleaned = input.replace(/[^0-9.]/g, "");
    const value = parseFloat(cleaned);
    if (isNaN(value) || value <= 0) return null;
    return value;
}

function formatCurrency(amount, code) {
    if (amount >= 1e15) {
        return (amount / 1e12).toFixed(1) + "T";
    }
    if (amount >= 1e12) {
        return (amount / 1e12).toFixed(2) + "T";
    }
    if (amount >= 1e9) {
        return (amount / 1e9).toFixed(2) + "B";
    }
    if (amount >= 1e6) {
        return (amount / 1e6).toFixed(2) + "M";
    }
    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function getCurrencyName(code) {
    return CURRENCY_NAMES[code] || code;
}

function displayResults(netWorth, rates) {
    const currencies = Object.entries(rates).map(([code, rate]) => ({
        code: code,
        name: getCurrencyName(code),
        converted: netWorth * rate
    }));

    // Sort ascending by converted value (strongest currencies first, like a leaderboard)
    currencies.sort((a, b) => a.converted - b.converted);

    // Find the strongest currency where user is a millionaire
    // (first one in ascending list that's >= 1M = hardest milestone reached)
    const millionaireIndex = currencies.findIndex(c => c.converted >= 1000000);

    const banner = document.getElementById("result-banner");
    const results = document.getElementById("results");
    const tbody = document.getElementById("currency-table");

    const bannerText = document.getElementById("banner-text");
    const checkBtn = document.getElementById("check-it-out");

    if (millionaireIndex !== -1) {
        const currency = currencies[millionaireIndex];
        bannerText.textContent = "You're a millionaire in " + currency.name + " (" + currency.code + ")!";
        checkBtn.classList.remove("hidden");
        banner.classList.remove("hidden");
    } else {
        bannerText.textContent = "Keep saving! You're not yet a millionaire in any currency.";
        checkBtn.classList.add("hidden");
        banner.classList.remove("hidden");
    }

    tbody.innerHTML = "";

    currencies.forEach((currency, index) => {
        const row = document.createElement("tr");
        const isMillionaire = currency.converted >= 1000000;
        const isHighlightRow = index === millionaireIndex;

        if (isHighlightRow) {
            row.classList.add("highlight");
        } else if (!isMillionaire) {
            row.classList.add("above-million");
        }

        const rank = document.createElement("td");
        rank.textContent = index + 1;

        const name = document.createElement("td");
        name.textContent = currency.name + " (" + currency.code + ")";

        const value = document.createElement("td");
        value.textContent = formatCurrency(currency.converted, currency.code);

        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(value);
        tbody.appendChild(row);
    });

    results.classList.remove("hidden");

    // Scroll to highlighted row when "Check it out" is clicked
    checkBtn.onclick = function() {
        const highlightedRow = tbody.querySelector(".highlight");
        if (highlightedRow) {
            highlightedRow.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };
}

document.getElementById("net-worth-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const input = document.getElementById("net-worth").value;
    const netWorth = parseNetWorth(input);

    if (!netWorth) {
        alert("Please enter a valid dollar amount.");
        return;
    }

    const button = this.querySelector("button");
    button.textContent = "Loading...";
    button.disabled = true;

    try {
        const rates = await fetchRates();
        displayResults(netWorth, rates);
    } catch (error) {
        alert("Failed to fetch exchange rates. Please try again.\n" + error.message);
    } finally {
        button.textContent = "Find Out";
        button.disabled = false;
    }
});
