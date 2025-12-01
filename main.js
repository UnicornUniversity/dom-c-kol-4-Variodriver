/*
let names = [
    {
        gender: "male",
        names: ["Jan", "Miroslav", "Petr", "Michal", "Milan", "Antonio", "Tobiáš", "Josef", "Tim", "Vítek", "Vít", "Richard", "Dalibor", "Libor", "Jevhen", "Daniel", "Dan", "Oleg", "Tomáš", "Miro", "Jiří", "Pavel", "Pavol", "Beno", "Roman", "Jakub", "Václav", "Makar", "Ivan", "Marek", "Martin", "Matěj", "Marcel", "Adam", "Mikuláš", "Zdeněk", "Přemysl", "Jonáš", "David", "Rudolf", "Kryštof", "Michael", "Ondřej", "Vladimír", "Antonín", "Vilém", "Luděk", "Lukáš", "Albert", "Vladislav"],
        surnames: ["Moravec", "Samek", "Briscein", "Hliněnský", "Lehotský", "Horák", "Šokalo", "Hájek", "Tolaš", "Kořínek", "Bartoš", "Sulženko", "Hoza", "Bruckler", "Kubáň", "Markvart", "Blachut", "Matoušek", "Nekoranec", "Veber", "Král", "Nový", "Novotný", "Novák", "Zima", "Skočdopole", "Lenčéš", "Votrubec", "Černý", "Červený", "Zeman", "Zikmund", "Velebný", "Patera", "Čada", "Houška", "Hrachovec", "Cihlář", "Vaník", "Krystl", "Makovec", "Sloup", "Kalaš", "Panc", "Friesl", "Marek", "Boháč", "Bozděch", "Válek", "Staněk"]
    },

    {
        gender: "female",
        names: ["Ivana", "Radka", "Pavla", "Iveta", "Miroslava", "Petra", "Milena", "Jarmila", "Jaroslava", "Marcela", "Johana", "Jasmína", "Barbora", "Natálie", "Amélie", "Simona", "Michaela", "Sofie", "Jitka", "Leona", "Jana", "Lenka", "Kristýna", "Adriana", "Dana", "Karolína", "Irena", "Vanessa", "Jindřiška", "Alina", "Eliška", "Lucie", "Magdaléna", "Olga", "Anežka", "Dominika", "Aneta", "Hedvika", "Marie", "Alžběta", "Gabriela", "Antonie", "Milada", "Vilma", "Veronika"],
        surnames: ["Vachovcová", "Veberová", "Nováková", "Novotná", "Nová", "Sehnoutková", "Hájková", "Urbanová", "Milá", "Černá", "Jíránková", "Poláčková", "Kopřivová", "Smetana", "Jalovcová", "Bařáková", "Limberská", "Vavrochová", "Šavelová", "Nerudová", "Zapletalová", "Zahradníková", "Palacká", "Votrubcová", "Lopatová", "Radová", "Gebertová", "Kroupová", "Kinjo", "Šrejmová", "Zavadilová", "Janečková", "Janáčková", "Zlámalová", "Drápelová", "Donutilová", "Čermáková", "Patejdlová", "Boháčová", "Pohsoltová"]
    }
];
 */

// Reduced names (bcs there is limit in tests)
let names = [
    {
        gender: "male",
        names: ["Jan", "Miroslav", "Petr", "Michal", "Milan", "Antonio", "Tobiáš", "Josef", "Tim", "Vítek", "Vít", "Richard"],
        surnames: ["Moravec", "Samek", "Briscein", "Hliněnský", "Lehotský", "Horák", "Šokalo", "Hájek", "Tolaš", "Kořínek", "Bartoš", "Sulženko"]
    },

    {
        gender: "female",
        names: ["Ivana", "Radka", "Pavla", "Iveta", "Miroslava", "Petra", "Milena", "Jarmila", "Jaroslava", "Marcela", "Johana", "Jasmína"],
        surnames: ["Vachovcová", "Veberová", "Nováková", "Novotná", "Nová", "Sehnoutková", "Hájková", "Urbanová", "Milá", "Černá", "Jíránková", "Poláčková"]
    }
];

let workloads = [10, 20, 30, 40];


function generateBirthday(minAge, maxAge) {
    const now = new Date();

    const youngest = new Date(now);
    youngest.setFullYear(youngest.getFullYear() - minAge);

    const oldest = new Date(now);
    oldest.setFullYear(oldest.getFullYear() - maxAge);

    const oldestTime = oldest.getTime();
    const diff = youngest.getTime() - oldestTime; // in ms

    const randomTime = oldestTime + Math.random() * diff;
    return new Date(randomTime);
}

function generatePerson(dataset, minAge, maxAge) {
    return {
            gender: dataset.gender,
            birthdate: generateBirthday(minAge, maxAge).toISOString(),
            name: dataset.names[Math.floor(Math.random() * dataset.names.length)],
            surname: dataset.surnames[Math.floor(Math.random() * dataset.surnames.length)],
            workload: workloads[Math.floor(Math.random() * workloads.length)]
           };
}

export function generateEmployeeData(dtoIn) {
    let dtoOut = [];

    for (let i = 0; i < dtoIn.count; i++) {
        let selectedDataset = names[Math.floor(Math.random() * names.length)];
        dtoOut.push(generatePerson(selectedDataset, dtoIn.age.min, dtoIn.age.max));

    }

    return dtoOut;
}

function getAge(date) {
    let diff = Date() - new Date(date).getTime();
    return new Date(diff).getUTCFullYear();
}

export function getEmployeeStatistics(dtoIn) {
    let dtoOut = {
        total: 0,
        workload10: 0,
        workload20: 0,
        workload30: 0,
        workload40: 0,
        averageAge: 0,
        minAge: 0,
        maxAge: 0,
        medianAge: 0,
        medianWorkload: 0,
        sortedByWorkload: [],
        averageWomenWorkload: 0
    };

    // Temp variables to count averageWomenWorkload
    let womenCount = 0;
    let womenWorkloadSum = 0;

    // Temp variable to count averageAge
    let agesSum = 0;
    
    // Temp variable to count medianAge
    let allAges = [];

    // Temp variable to count medianWorkload
    let allWorkloads = [];

    // Compute values
    for (const employee of dtoIn) {
        let age = getAge(employee.birthdate);
        dtoOut.total += 1;

        switch (employee.workload) {
            case 10:
                dtoOut.workload10 += 1;
                break
            case 20:
                dtoOut.workload20 += 1;
                break
            case 30:
                dtoOut.workload30 += 1;
                break
            case 40:
                dtoOut.workload40 += 1;
                break
        }

        agesSum += age;
        
        dtoOut.minAge = Math.min(dtoOut.minAge, age);
        dtoOut.maxAge = Math.max(dtoOut.maxAge, age);

        allAges.push(age);
        allWorkloads.push(employee.workload);

        if (employee.gender === "female") {
            womenCount += 1;
            womenWorkloadSum += employee.workload;
        }

        dtoOut.sortedByWorkload.push(employee);
    }
    
    dtoOut.averageAge = agesSum / allAges.length;

    allAges.sort();
    allWorkloads.sort();

    if (allAges.length % 2 === 0) {
        let index = Math.floor(allAges.length / 2);
        dtoOut.medianAge = (allAges[index] + allAges[index + 1]) / 2;
        dtoOut.medianWorkload = (allWorkloads[index] + allWorkloads[index + 1]) / 2;
    } else {
        let index = allAges.length / 2;
        dtoOut.medianAge = allAges[index];
    }

    dtoOut.sortedByWorkload.sort((a, b) => {
        if (a.workload > b.workload) return 1;
        if (a.workload < b.workload) return 1;
        return 0;
    });

    dtoOut.averageWomenWorkload = womenWorkloadSum / womenCount;

    return dtoOut;
}


/**
 * Generator of employees
 *
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function main(dtoIn) {

    let employees = generateEmployeeData(dtoIn);

    let dtoOut = getEmployeeStatistics(employees);

    return dtoOut;
}

/*
console.log(main({
    count: 1,
    age: {
        min: 2,
        max: 8
    }
})[0]);*/
