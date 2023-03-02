function getFalafel() {
    const falafel = "Falafel";
    console.log(falafel + " aus dem Kühlschrank geholt");
    return Promise.resolve(falafel);
}

function fryFalafel(falafel) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            const friedFalafel = "Frittierte " + falafel;
            console.log(falafel + " frittiert");
            if (Math.random() <= 0.7) {
                resolve(friedFalafel);
            } else {
                reject("Falafel ist angebrannt");
            }
        }, 1000);
    });

}

function getWrap() {
    const wrap = "Wrap"
    console.log(wrap + " aus dem Schrank geholt")
    return Promise.resolve(wrap);
}

function assembleFalafelWrap(wrap, friedFalafel) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    return Promise.resolve(falafelwrap);
}

async function prepareFalafelWrap() {
    let [falafel, wrap] = await Promise.all([getFalafel(), getWrap()]);
    let friedFalafel = await fryFalafel(falafel);
    return assembleFalafelWrap(wrap, friedFalafel);
}

async function serve() {
    try {
        let meal = await prepareFalafelWrap();
        console.log(meal + " serviert");
    } catch (e) {
        console.error("Fehler:", e);
    }

}

serve();
