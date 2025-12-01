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

function getAge(birthdate) {
    const now = new Date();
    const dob = new Date(birthdate);

    const diffMs = now - dob;
    const ageYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    return ageYears;
}

export function getEmployeeStatistics(dtoIn) {
    let dtoOut = {
        total: 0,
        workload10: 0,
        workload20: 0,
        workload30: 0,
        workload40: 0,
        averageAge: 0,
        minAge: Infinity,
        maxAge: -Infinity,
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

        //dtoOut.minAge = Math.min(dtoOut.minAge, Number.parseFloat(age.toFixed(0)));
        //dtoOut.maxAge = Math.max(dtoOut.maxAge, Number.parseFloat(age.toFixed(0)));

        dtoOut.minAge = Math.min(dtoOut.minAge, (age | 0));
        dtoOut.maxAge = Math.max(dtoOut.maxAge, (age | 0));

        allAges.push(age);
        allWorkloads.push(employee.workload);

        if (employee.gender === "female") {
            womenCount += 1;
            womenWorkloadSum += employee.workload;
        }

        dtoOut.sortedByWorkload.push(employee);
    }

    if (allAges.length > 0) {
        dtoOut.averageAge = agesSum / allAges.length;
        dtoOut.averageAge = Number.parseFloat(dtoOut.averageAge.toFixed(1));
    } else {
        dtoOut.averageAge = 0;
    }

    allAges.sort((a, b) => a - b);
    allWorkloads.sort((a, b) => a - b);

    if (allAges.length > 0) {
        const mid = Math.floor(allAges.length / 2);
        let medianAge;
        if (allAges.length % 2 === 0) {
            medianAge = (allAges[mid - 1] + allAges[mid]) / 2;
            dtoOut.medianWorkload = (allWorkloads[mid - 1] + allWorkloads[mid]) / 2;
        } else {
            medianAge = allAges[mid];
            dtoOut.medianWorkload = allWorkloads[mid];
        }
        dtoOut.medianAge = Number(medianAge.toFixed(0));
    } else {
        dtoOut.medianAge = 0;
        dtoOut.medianWorkload = 0;
    }
    
    dtoOut.sortedByWorkload.sort((a, b) => {
        if (a.workload > b.workload) return 1;
        if (a.workload < b.workload) return -1;
        return 0;
    });

    if (womenCount > 0) {
        dtoOut.averageWomenWorkload = womenWorkloadSum / womenCount;
        dtoOut.averageWomenWorkload = Number.parseFloat(dtoOut.averageWomenWorkload.toFixed(1));
    } else {
        dtoOut.averageWomenWorkload = 0;
    }

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
    count: 51,
    age: {
        min: 1,
        max: 4
    }
}));

 */

