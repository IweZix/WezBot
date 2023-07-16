module.exports = async (xp, level) => {

    let xpTotal = 0
    for (let i = 0; i < level; i++) {
        xpTotal += parseInt((level + 1) * 1000)
    }
    xpTotal += xp

    return xpTotal
}