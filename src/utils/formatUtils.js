const formatCurrency = (value) => {
    const formattedValue = new Intl.NumberFormat("es-CO",{
        style: "currency",
        currency: "COP",
        minimunFractionDigits: 0,
    }).format(value);
    return formattedValue.replace(",00","");
    
};
export default formatCurrency;