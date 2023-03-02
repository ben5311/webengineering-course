function getFalafel() {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    return Promise.resolve(falafel);
}

function fryFalafel(falafel) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            const friedFalafel = "Frittierte " + falafel;
            console.log(falafel + " frittiert");
            resolve(friedFalafel);
        }, 1000);
    });
}

function getWrap(friedFalafel) {
    const wrap = "Wrap";
    console.log(wrap + " aus dem Schrank geholt");
    return Promise.resolve({wrap: wrap, friedFalafel: friedFalafel});
}

function assembleFalafelWrap(wrap, friedFalafel) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    return Promise.resolve(falafelwrap);
}

function prepareFalafelWrap() {
    return getFalafel()
        .then(fryFalafel)
        .then(getWrap)
        .then(wrapAndFalafel => assembleFalafelWrap(wrapAndFalafel.wrap, wrapAndFalafel.friedFalafel));
}

function serve(meal) {
    console.log(meal + " serviert");
}

prepareFalafelWrap().then(serve);
