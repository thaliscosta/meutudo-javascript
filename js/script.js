function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function searchConversionRates() {
    const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
    return response.data;
}

function calculateConversion(amount, bid) {
    return amount / bid;
}

const form = document.querySelector('#formConversion');
const result = document.querySelector('#result');
const amountInput = document.querySelector('#amount');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currency = document.querySelector('#currency').value;
    const amount = parseFloat(amountInput.value.replace(/\./g, '').replace(',', '.'));

    if (amount >= 1000) {
        result.innerHTML = '';

        try {
            const data = await searchConversionRates();
            const selectedCurrency = data[`${currency}BRL`];
            const bid = parseFloat(selectedCurrency.bid);
            const conversionResult = calculateConversion(amount, bid);

            result.innerHTML = `
            <div class="content">
            <strong>Valor em Real:</strong> R$ ${formatCurrency(amount)}<br>
            <strong>Moeda:</strong> ${selectedCurrency.name}<br>
            <strong>Valor de compra:</strong> R$ ${formatCurrency(bid)}<br>
            <strong>Resultado:</strong> ${currency} ${formatCurrency(conversionResult)}
            </div>
            `;
        } catch (error) {
            result.innerHTML = 'Ocorreu um erro ao buscar a cotação. Tente novamente.';
        }
        
    } else {
        result.innerHTML = 'O valor mínimo para cotação é R$ 1.000,00.';
    }
});


VMasker(amountInput).maskMoney({
  precision: 2,
  separator: ',',
  delimiter: '.',
  zeroCents: false,
});