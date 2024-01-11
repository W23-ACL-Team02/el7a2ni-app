const medicineBodyOutOfStock = (medicineName) => {
    return `Medicine ${medicineName} has just ran out of stock. Restock soon.`
}

const medicineTitleOutOfStock = () => {
    return `Medicine Out Of Stock`
}

module.exports = { medicineBodyOutOfStock, medicineTitleOutOfStock }