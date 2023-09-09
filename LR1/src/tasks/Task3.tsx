const getGenerator3 = (PA: number, PBA: number) => {
    const P_NOTA = 1 - PA;
    const PAB = PA * PBA; // 1 // P (A | B)

    const PNOTA_B = 1 - PBA; // 2

    const P_AB = PA * PBA; // P(AB)
    const PA_NOTB = PA - P_AB; // 3
    const P_NOTA_NOTB = P_NOTA - PA_NOTB; // P(!A!B)
};