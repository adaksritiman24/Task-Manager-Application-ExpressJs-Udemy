const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require("../src/math");

test('should Calculate Total With Tip',()=>{
    const total = calculateTip(10, 0.3);

    expect(total).toBe(13);  
})

test('should Calculate Total with default tip',()=>{
    const total = calculateTip(10);

    expect(total).toBe(12.5);
})

test('should convert 32 F to 0 C', ()=>{
    const tempInCelsius = fahrenheitToCelsius(32);
    expect(tempInCelsius).toBe(0);
})

test('should conver 0 C to 32 F', ()=>{
    const tempInFahrenheit = celsiusToFahrenheit(0);
    expect(tempInFahrenheit).toBe(32);
})

// test('Async test demo', (done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(1);
//         done();
//     }, 2000);

// })

test("Should Add two numbers", (done)=>{
    add(2, 3).then((sum)=>{
        expect(sum).toBe(5);
        done();
    });
})
test("Should Add two numbers async await", async()=>{
    const sum = await add(2, 3);
    expect(sum).toBe(5);
})