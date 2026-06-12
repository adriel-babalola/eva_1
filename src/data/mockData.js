const NIGERIAN_STATES = [
  "Osun State", "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State",
  "Bauchi State", "Bayelsa State", "Benue State", "Borno State", "Cross River State",
  "Delta State", "Ebonyi State", "Edo State", "Ekiti State", "Enugu State",
  "Gombe State", "Imo State", "Jigawa State", "Kaduna State", "Kano State",
  "Katsina State", "Kebbi State", "Kogi State", "Kwara State", "Lagos State",
  "Nasarawa State", "Niger State", "Ogun State", "Ondo State", "Oyo State",
  "Plateau State", "Rivers State", "Sokoto State", "Taraba State", "Yobe State",
  "Zamfara State"
];

// Helper to generate deterministic pseudo-random numbers based on a string seed
function seedRandom(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

export const results = NIGERIAN_STATES.map((stateName, stateIndex) => {
  const rand = seedRandom(stateName);
  const stateId = `st-${stateName.toLowerCase().replace(/ /g, '-')}`;

  // Assign some realistic status
  const stateStatus = stateIndex === 0 ? 'progress' : (rand() > 0.6 ? 'verified' : (rand() > 0.3 ? 'progress' : 'pending'));

  const lgas = ['North', 'South'].map((dir, lgaIndex) => {
    const lgaName = `${stateName.split(' ')[0]} ${dir} LGA`;
    const lgaId = `lga-${stateId.replace('st-', '')}-${dir.toLowerCase()}`;
    const lgaStatus = stateStatus === 'verified' ? 'verified' : (stateStatus === 'pending' ? 'pending' : (rand() > 0.5 ? 'verified' : 'unverified'));

    const wards = ['Ward I', 'Ward II'].map((wardName, wardIndex) => {
      const wardId = `wd-${lgaId.replace('lga-', '')}-${wardIndex + 1}`;
      const wardStatus = lgaStatus === 'verified' ? 'verified' : (lgaStatus === 'pending' ? 'pending' : (rand() > 0.4 ? 'verified' : 'unverified'));

      const pus = ['Central Hall', 'Health Center'].map((puName, puIndex) => {
        const puId = `pu-${wardId.replace('wd-', '')}-${puIndex + 1}`;
        const puStatus = wardStatus === 'verified' ? 'verified' : (wardStatus === 'pending' ? 'pending' : (rand() > 0.3 ? 'verified' : 'unverified'));

        // Generate voter counts
        // Registered: 10,000 to 25,000 per PU
        const registered = Math.floor(10000 + rand() * 15000);
        // Accredited: 40% to 70% of registered
        const accredited = Math.floor(registered * (0.4 + rand() * 0.3));
        // Casted: 90% to 98% of accredited (guaranteed to be strictly less than accredited!)
        const casted = Math.floor(accredited * (0.90 + rand() * 0.08));

        // Let's divide votes between parties
        const rejected = Math.floor(casted * (0.01 + rand() * 0.02));
        const valid = casted - rejected;

        // Deterministic party performance weights
        let ndcWeight = 0.2 + rand() * 0.3;
        let apcWeight = 0.2 + rand() * 0.3;
        let lpWeight = 0.1 + rand() * 0.2;
        let nnppWeight = 0.05 + rand() * 0.15;
        const totalWeight = ndcWeight + apcWeight + lpWeight + nnppWeight;

        ndcWeight /= totalWeight;
        apcWeight /= totalWeight;
        lpWeight /= totalWeight;
        nnppWeight /= totalWeight;

        const ndc = Math.floor(valid * ndcWeight);
        const apc = Math.floor(valid * apcWeight);
        const lp = Math.floor(valid * lpWeight);
        const nnpp = valid - (ndc + apc + lp); // NNPP gets the remainder to sum to valid exactly

        return {
          id: puId,
          name: `PU 00${puIndex + 1} - ${puName}`,
          registered,
          accredited,
          casted,
          valid,
          rejected,
          ndc,
          apc,
          lp,
          nnpp,
          status: puStatus
        };
      });

      return {
        id: wardId,
        name: `${lgaName.replace(' LGA', '')} - ${wardName}`,
        status: wardStatus,
        pus
      };
    });

    return {
      id: lgaId,
      name: lgaName,
      status: lgaStatus,
      wards
    };
  });

  return {
    id: stateId,
    name: stateName,
    status: stateStatus,
    lgas
  };
});

// Construct stateData by aggregating data from the results tree
export const stateData = {};

results.forEach(state => {
  let registered = 0;
  let accredited = 0;
  let casted = 0;
  let valid = 0;
  let rejected = 0;
  let ndc = 0;
  let apc = 0;
  let lp = 0;
  let nnpp = 0;

  let unitsTotal = 0;
  let unitsReported = 0;
  let lgasTotal = state.lgas.length;
  let lgasReported = 0;

  state.lgas.forEach(lga => {
    if (lga.status !== 'pending') {
      lgasReported++;
    }
    lga.wards.forEach(ward => {
      ward.pus.forEach(pu => {
        unitsTotal++;
        if (pu.status !== 'pending') {
          unitsReported++;
        }
        registered += pu.registered;
        accredited += pu.accredited;
        casted += pu.casted;
        valid += pu.valid;
        rejected += pu.rejected;
        ndc += pu.ndc;
        apc += pu.apc;
        lp += pu.lp;
        nnpp += pu.nnpp;
      });
    });
  });

  const turnout = accredited > 0 ? parseFloat(((accredited / registered) * 100).toFixed(1)) : 0;
  const verifiedPct = unitsReported > 0 ? Math.round((unitsReported / unitsTotal) * 100) : 0;

  stateData[state.name] = {
    summary: {
      registered,
      accredited,
      casted,
      valid,
      rejected,
      turnout,
      lgasReported,
      lgasTotal,
      unitsReported,
      unitsTotal,
      verifiedPct
    },
    parties: [
      { id: 'ndc',  name: 'NDC',  votes: ndc, color: '#00C896' },
      { id: 'apc',  name: 'APC',  votes: apc, color: '#3B82F6' },
      { id: 'lp',   name: 'LP',   votes: lp, color: '#FF3B5C' },
      { id: 'nnpp', name: 'NNPP', votes: nnpp, color: '#F59E0B' }
    ]
  };
});

export const summary = stateData['Osun State'].summary;
export const parties = stateData['Osun State'].parties;
