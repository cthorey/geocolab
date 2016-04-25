var map = new Datamap({
    scope : 'world',
    element: document.getElementById('map-container'),
    projection: 'mercator',
    height : 500,
    
    fills: {
        'AFG': '#FEDFD0',
        'AGO': '#FCBFA7',
        'ALB': '#FCBEA5',
        'AND': '#FDD4C2',
        'ARE': '#E53228',
        'ARG': '#B91419',
        'ARM': '#FA6849',
        'ASM': '#FFEDE5',
        'ATA': '#FED8C7',
        'AUS': '#840711',
        'AUT': '#A60F15',
        'BDI': '#FEE9DF',
        'BEL': '#A81016',
        'BEN': '#F6583E',
        'BFA': '#F14432',
        'BGD': '#D82422',
        'BGR': '#FCA486',
        'BHS': '#FFEEE7',
        'BLZ': '#FFF4EF',
        'BMU': '#FCA588',
        'BOL': '#FC9D7F',
        'BRA': '#8A0812',
        'BRB': '#FC9272',
        'BRN': '#FC8262',
        'BTN': '#FCAB8F',
        'BWA': '#FB7353',
        'CAF': '#FEE5D9',
        'CAN': '#7A0510',
        'CHE': '#860811',
        'CHL': '#AD1117',
        'CHN': '#79040F',
        'CIV': '#F75C41',
        'CMR': '#FCAF93',
        'COG': '#FB7050',
        'COK': '#FFF2EC',
        'COL': '#BD151A',
        'CPV': '#FC8D6D',
        'CRI': '#DC2924',
        'CUB': '#FCC3AB',
        'CYM': '#FFEFE8',
        'CYP': '#FB6E4E',
        'CZE': '#B61319',
        'DEU': '#6D010E',
        'DJI': '#FDC5AE',
        'DMA': '#FDC6B0',
        'DNK': '#AA1016',
        'DZA': '#FC8565',
        'ECU': '#C7171C',
        'EGY': '#F03D2D',
        'ERI': '#FFF1EA',
        'ESP': '#9D0D14',
        'EST': '#F75B40',
        'ETH': '#EA362A',
        'FIN': '#AF1117',
        'FJI': '#FB7656',
        'FRA': '#75030F',
        'FSM': '#FFF0E9',
        'GAB': '#FCBBA1',
        'GBR': '#73030F',
        'GEO': '#A30F15',
        'GHA': '#F5533B',
        'GIN': '#FC9474',
        'GLP': '#FC8A6A',
        'GRC': '#CE1A1E',
        'GRL': '#FB6C4C',
        'GTM': '#F85F43',
        'GUF': '#FEE3D6',
        'GUM': '#FEE3D7',
        'HKG': '#BF151B',
        'HRV': '#FCA082',
        'HTI': '#FCBCA2',
        'HUN': '#E32F27',
        'IDN': '#C3161B',
        'IND': '#980C13',
        'IRL': '#C4161C',
        'IRN': '#D42121',
        'IRQ': '#FEE5D8',
        'ISL': '#B51318',
        'ISR': '#B81419',
        'ITA': '#800610',
        'JAM': '#FB7B5B',
        'JEY': '#CF1C1F',
        'JOR': '#FCB398',
        'JPN': '#6F020E',
        'KAZ': '#F0402F',
        'KEN': '#E93529',
        'KGZ': '#FC9C7D',
        'KHM': '#FEE7DB',
        'KIR': '#FEE1D4',
        'KOR': '#FC8666',
        'KWT': '#FCA183',
        'LAO': '#FCAD90',
        'LBN': '#FB7252',
        'LCA': '#FEE7DC',
        'LKA': '#FC8E6E',
        'LSO': '#FEEAE1',
        'LTU': '#FCA98C',
        'LUX': '#D21F20',
        'LVA': '#FEE1D3',
        'MAR': '#F24633',
        'MDG': '#F6563D',
        'MEX': '#8C0912',
        'MKD': '#FDD1BE',
        'MLI': '#ED392B',
        'MLT': '#FC9879',
        'MMR': '#FCB79C',
        'MNG': '#EC382B',
        'MOZ': '#FEDECF',
        'MSR': '#FDD0BC',
        'MWI': '#EF3C2C',
        'MYS': '#F44F39',
        'MYT': '#FFECE4',
        'NAM': '#FB7D5D',
        'NCL': '#FA6547',
        'NER': '#E22E27',
        'NIC': '#FEE8DE',
        'NLD': '#900A12',
        'NOR': '#A10E15',
        'NPL': '#CA181D',
        'NZL': '#9C0D14',
        'OMN': '#D52221',
        'PAK': '#F5523A',
        'PAN': '#F44D38',
        'PER': '#DE2B25',
        'PHL': '#D11E1F',
        'PLW': '#FEDBCC',
        'POL': '#BC141A',
        'PRI': '#DB2824',
        'PRK': '#7E0610',
        'PRT': '#C8171C',
        'PSE': '#FEDACA',
        'PYF': '#FC8161',
        'QAT': '#F34935',
        'REU': '#FDCDB9',
        'RUS': '#AB1016',
        'RWA': '#FCB499',
        'SAU': '#CB181D',
        'SEN': '#FB7757',
        'SGP': '#B11218',
        'SLB': '#FCA78B',
        'SLV': '#FC997A',
        'SRB': '#FB7A5A',
        'SVK': '#FC8969',
        'SVN': '#FB694A',
        'SWE': '#960B13',
        'SWZ': '#FDCCB8',
        'SYC': '#FFEBE2',
        'SYR': '#FDCAB5',
        'TCD': '#FCB89E',
        'TGO': '#FDD7C6',
        'THA': '#D92523',
        'TJK': '#FC9576',
        'TTO': '#F34A36',
        'TUN': '#F96346',
        'TUR': '#B21218',
        'TWN': '#920A13',
        'TZA': '#E02C26',
        'UGA': '#FDC9B3',
        'UKR': '#F14130',
        'URY': '#F96044',
        'USA': '#69000D',
        'UZB': '#FDD3C1',
        'VEN': '#FC7F5F',
        'VGB': '#FFF3ED',
        'VNM': '#E63328',
        'VUT': '#FC9070',
        'ZAF': '#C1161B',
        'ZMB': '#FCB095',
        'ZWE': '#FCC2AA',
        defaultFill: 'grey'
        },

        data : {
            "AFG": {
                "Maintopic": "Seismology : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "AFG"
            }, 
            "AGO": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "AGO"
            }, 
            "ALB": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "ALB"
            }, 
            "AND": {
                "Maintopic": "Cryosphere : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "AND"
            }, 
            "ARE": {
                "Maintopic": "Atmospheric Sciences : 36.7 %", 
                "Ncontributions": 30, 
                "Ncontributors": 24, 
                "Secondtopic": "Planetary Sciences : 16.7 %", 
                "Thirdtopic": "Paleoceanography and Paleoclimatology : 6.7 %", 
                "fillKey": "ARE"
            }, 
            "ARG": {
                "Maintopic": "Tectonophysics : 23.3 %", 
                "Ncontributions": 129, 
                "Ncontributors": 108, 
                "Secondtopic": "Hydrology : 17.1 %", 
                "Thirdtopic": "SPA-Solar and Heliospheric Physics : 14.0 %", 
                "fillKey": "ARG"
            }, 
            "ARM": {
                "Maintopic": "Tectonophysics : 33.3 %", 
                "Ncontributions": 9, 
                "Ncontributors": 7, 
                "Secondtopic": "Atmospheric and Space Electricity : 22.2 %", 
                "Thirdtopic": "Seismology : 22.2 %", 
                "fillKey": "ARM"
            }, 
            "ASM": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "ASM"
            }, 
            "ATA": {
                "Maintopic": "Planetary Sciences : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "ATA"
            }, 
            "AUS": {
                "Maintopic": "Biogeosciences : 19.0 %", 
                "Ncontributions": 1378, 
                "Ncontributors": 936, 
                "Secondtopic": "Hydrology : 14.8 %", 
                "Thirdtopic": "Paleoceanography and Paleoclimatology : 11.0 %", 
                "fillKey": "AUS"
            }, 
            "AUT": {
                "Maintopic": "SPA-Magnetospheric Physics : 33.5 %", 
                "Ncontributions": 436, 
                "Ncontributors": 229, 
                "Secondtopic": "Atmospheric Sciences : 9.9 %", 
                "Thirdtopic": "Biogeosciences : 8.0 %", 
                "fillKey": "AUT"
            }, 
            "BDI": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "BDI"
            }, 
            "BEL": {
                "Maintopic": "Atmospheric Sciences : 15.5 %", 
                "Ncontributions": 419, 
                "Ncontributors": 271, 
                "Secondtopic": "Hydrology : 12.6 %", 
                "Thirdtopic": "SPA-Solar and Heliospheric Physics : 10.5 %", 
                "fillKey": "BEL"
            }, 
            "BEN": {
                "Maintopic": "Global Environmental Change : 66.7 %", 
                "Ncontributions": 12, 
                "Ncontributors": 19, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 8.3 %", 
                "Thirdtopic": "Hydrology : 8.3 %", 
                "fillKey": "BEN"
            }, 
            "BFA": {
                "Maintopic": "Global Environmental Change : 100.0 %", 
                "Ncontributions": 18, 
                "Ncontributors": 18, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "BFA"
            }, 
            "BGD": {
                "Maintopic": "Global Environmental Change : 36.5 %", 
                "Ncontributions": 52, 
                "Ncontributors": 46, 
                "Secondtopic": "Hydrology : 21.2 %", 
                "Thirdtopic": "Natural Hazards : 17.3 %", 
                "fillKey": "BGD"
            }, 
            "BGR": {
                "Maintopic": "Biogeosciences : 50.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 4, 
                "Secondtopic": "Atmospheric Sciences : 25.0 %", 
                "Thirdtopic": "Geodesy : 25.0 %", 
                "fillKey": "BGR"
            }, 
            "BHS": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "BHS"
            }, 
            "BLZ": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "BLZ"
            }, 
            "BMU": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 75.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 4, 
                "Secondtopic": "Global Environmental Change : 25.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "BMU"
            }, 
            "BOL": {
                "Maintopic": "Biogeosciences : 25.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 5, 
                "Secondtopic": "Tectonophysics : 25.0 %", 
                "Thirdtopic": "Atmospheric Sciences : 25.0 %", 
                "fillKey": "BOL"
            }, 
            "BRA": {
                "Maintopic": "Atmospheric Sciences : 23.3 %", 
                "Ncontributions": 889, 
                "Ncontributors": 628, 
                "Secondtopic": "Biogeosciences : 20.1 %", 
                "Thirdtopic": "Hydrology : 13.8 %", 
                "fillKey": "BRA"
            }, 
            "BRB": {
                "Maintopic": "Atmospheric Sciences : 60.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 5, 
                "Secondtopic": "Natural Hazards : 40.0 %", 
                "Thirdtopic": "Biogeosciences : 0.0 %", 
                "fillKey": "BRB"
            }, 
            "BRN": {
                "Maintopic": "Biogeosciences : 100.0 %", 
                "Ncontributions": 6, 
                "Ncontributors": 5, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "BRN"
            }, 
            "BTN": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "BTN"
            }, 
            "BWA": {
                "Maintopic": "Tectonophysics : 57.1 %", 
                "Ncontributions": 7, 
                "Ncontributors": 7, 
                "Secondtopic": "Paleoceanography and Paleoclimatology : 28.6 %", 
                "Thirdtopic": "Biogeosciences : 14.3 %", 
                "fillKey": "BWA"
            }, 
            "CAF": {
                "Maintopic": "Global Environmental Change : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "CAF"
            }, 
            "CAN": {
                "Maintopic": "Hydrology : 16.5 %", 
                "Ncontributions": 2834, 
                "Ncontributors": 1808, 
                "Secondtopic": "Atmospheric Sciences : 13.2 %", 
                "Thirdtopic": "Biogeosciences : 9.6 %", 
                "fillKey": "CAN"
            }, 
            "CHE": {
                "Maintopic": "Atmospheric Sciences : 15.4 %", 
                "Ncontributions": 1120, 
                "Ncontributors": 685, 
                "Secondtopic": "Hydrology : 15.2 %", 
                "Thirdtopic": "Planetary Sciences : 10.6 %", 
                "fillKey": "CHE"
            }, 
            "CHL": {
                "Maintopic": "Hydrology : 22.8 %", 
                "Ncontributions": 378, 
                "Ncontributors": 259, 
                "Secondtopic": "Tectonophysics : 18.3 %", 
                "Thirdtopic": "Seismology : 16.9 %", 
                "fillKey": "CHL"
            }, 
            "CHN": {
                "Maintopic": "Atmospheric Sciences : 14.4 %", 
                "Ncontributions": 3680, 
                "Ncontributors": 2852, 
                "Secondtopic": "Hydrology : 11.7 %", 
                "Thirdtopic": "Biogeosciences : 9.2 %", 
                "fillKey": "CHN"
            }, 
            "CIV": {
                "Maintopic": "Atmospheric Sciences : 45.5 %", 
                "Ncontributions": 11, 
                "Ncontributors": 16, 
                "Secondtopic": "Global Environmental Change : 27.3 %", 
                "Thirdtopic": "Hydrology : 9.1 %", 
                "fillKey": "CIV"
            }, 
            "CMR": {
                "Maintopic": "Hydrology : 66.7 %", 
                "Ncontributions": 3, 
                "Ncontributors": 3, 
                "Secondtopic": "Earth and Planetary Surface Processes : 33.3 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "CMR"
            }, 
            "COG": {
                "Maintopic": "Tectonophysics : 50.0 %", 
                "Ncontributions": 8, 
                "Ncontributors": 7, 
                "Secondtopic": "Global Environmental Change : 25.0 %", 
                "Thirdtopic": "Biogeosciences : 12.5 %", 
                "fillKey": "COG"
            }, 
            "COK": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "COK"
            }, 
            "COL": {
                "Maintopic": "SPA-Solar and Heliospheric Physics : 17.8 %", 
                "Ncontributions": 107, 
                "Ncontributors": 96, 
                "Secondtopic": "Atmospheric Sciences : 15.0 %", 
                "Thirdtopic": "Tectonophysics : 14.0 %", 
                "fillKey": "COL"
            }, 
            "CPV": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 100.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 4, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "CPV"
            }, 
            "CRI": {
                "Maintopic": "Natural Hazards : 25.0 %", 
                "Ncontributions": 44, 
                "Ncontributors": 31, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 20.5 %", 
                "Thirdtopic": "Hydrology : 18.2 %", 
                "fillKey": "CRI"
            }, 
            "CUB": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 50.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 3, 
                "Secondtopic": "Seismology : 50.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "CUB"
            }, 
            "CYM": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "CYM"
            }, 
            "CYP": {
                "Maintopic": "Atmospheric Sciences : 100.0 %", 
                "Ncontributions": 8, 
                "Ncontributors": 10, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "CYP"
            }, 
            "CZE": {
                "Maintopic": "SPA-Magnetospheric Physics : 20.6 %", 
                "Ncontributions": 175, 
                "Ncontributors": 110, 
                "Secondtopic": "Geomagnetism and Paleomagnetism : 18.9 %", 
                "Thirdtopic": "Biogeosciences : 8.0 %", 
                "fillKey": "CZE"
            }, 
            "DEU": {
                "Maintopic": "Atmospheric Sciences : 17.0 %", 
                "Ncontributions": 4113, 
                "Ncontributors": 2462, 
                "Secondtopic": "Hydrology : 11.0 %", 
                "Thirdtopic": "Planetary Sciences : 9.3 %", 
                "fillKey": "DEU"
            }, 
            "DJI": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 100.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "DJI"
            }, 
            "DMA": {
                "Maintopic": "Global Environmental Change : 50.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Seismology : 50.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "DMA"
            }, 
            "DNK": {
                "Maintopic": "Cryosphere : 19.6 %", 
                "Ncontributions": 404, 
                "Ncontributors": 267, 
                "Secondtopic": "Hydrology : 12.6 %", 
                "Thirdtopic": "Biogeosciences : 11.1 %", 
                "fillKey": "DNK"
            }, 
            "DZA": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 83.3 %", 
                "Ncontributions": 6, 
                "Ncontributors": 4, 
                "Secondtopic": "Geomagnetism and Paleomagnetism : 16.7 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "DZA"
            }, 
            "ECU": {
                "Maintopic": "Seismology : 35.1 %", 
                "Ncontributions": 77, 
                "Ncontributors": 52, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 26.0 %", 
                "Thirdtopic": "Natural Hazards : 9.1 %", 
                "fillKey": "ECU"
            }, 
            "EGY": {
                "Maintopic": "Hydrology : 27.3 %", 
                "Ncontributions": 22, 
                "Ncontributors": 20, 
                "Secondtopic": "Geodesy : 13.6 %", 
                "Thirdtopic": "SPA-Solar and Heliospheric Physics : 13.6 %", 
                "fillKey": "EGY"
            }, 
            "ERI": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "ERI"
            }, 
            "ESP": {
                "Maintopic": "Planetary Sciences : 15.6 %", 
                "Ncontributions": 591, 
                "Ncontributors": 430, 
                "Secondtopic": "Hydrology : 13.7 %", 
                "Thirdtopic": "Tectonophysics : 9.3 %", 
                "fillKey": "ESP"
            }, 
            "EST": {
                "Maintopic": "Biogeosciences : 41.7 %", 
                "Ncontributions": 12, 
                "Ncontributors": 14, 
                "Secondtopic": "Global Environmental Change : 33.3 %", 
                "Thirdtopic": "Hydrology : 8.3 %", 
                "fillKey": "EST"
            }, 
            "ETH": {
                "Maintopic": "Hydrology : 28.0 %", 
                "Ncontributions": 25, 
                "Ncontributors": 23, 
                "Secondtopic": "Global Environmental Change : 24.0 %", 
                "Thirdtopic": "Volcanology, Geochemistry and Petrology : 16.0 %", 
                "fillKey": "ETH"
            }, 
            "FIN": {
                "Maintopic": "Atmospheric Sciences : 23.3 %", 
                "Ncontributions": 313, 
                "Ncontributors": 225, 
                "Secondtopic": "SPA-Magnetospheric Physics : 18.2 %", 
                "Thirdtopic": "Biogeosciences : 14.7 %", 
                "fillKey": "FIN"
            }, 
            "FJI": {
                "Maintopic": "Natural Hazards : 42.9 %", 
                "Ncontributions": 7, 
                "Ncontributors": 5, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 28.6 %", 
                "Thirdtopic": "Atmospheric and Space Electricity : 28.6 %", 
                "fillKey": "FJI"
            }, 
            "FRA": {
                "Maintopic": "Tectonophysics : 12.5 %", 
                "Ncontributions": 3876, 
                "Ncontributors": 2297, 
                "Secondtopic": "Planetary Sciences : 10.4 %", 
                "Thirdtopic": "Atmospheric Sciences : 9.5 %", 
                "fillKey": "FRA"
            }, 
            "FSM": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "FSM"
            }, 
            "GAB": {
                "Maintopic": "Earth and Planetary Surface Processes : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 3, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "GAB"
            }, 
            "GBR": {
                "Maintopic": "Atmospheric Sciences : 17.6 %", 
                "Ncontributions": 3959, 
                "Ncontributors": 2362, 
                "Secondtopic": "Hydrology : 9.3 %", 
                "Thirdtopic": "Tectonophysics : 7.6 %", 
                "fillKey": "GBR"
            }, 
            "GEO": {
                "Maintopic": "Atmospheric Sciences : 29.2 %", 
                "Ncontributions": 448, 
                "Ncontributors": 238, 
                "Secondtopic": "Paleoceanography and Paleoclimatology : 10.7 %", 
                "Thirdtopic": "Planetary Sciences : 9.4 %", 
                "fillKey": "GEO"
            }, 
            "GHA": {
                "Maintopic": "Global Environmental Change : 78.6 %", 
                "Ncontributions": 14, 
                "Ncontributors": 19, 
                "Secondtopic": "Paleoceanography and Paleoclimatology : 14.3 %", 
                "Thirdtopic": "Education : 7.1 %", 
                "fillKey": "GHA"
            }, 
            "GIN": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 100.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 6, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "GIN"
            }, 
            "GLP": {
                "Maintopic": "Tectonophysics : 60.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 5, 
                "Secondtopic": "Hydrology : 40.0 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "GLP"
            }, 
            "GRC": {
                "Maintopic": "Atmospheric Sciences : 34.3 %", 
                "Ncontributions": 67, 
                "Ncontributors": 57, 
                "Secondtopic": "SPA-Solar and Heliospheric Physics : 11.9 %", 
                "Thirdtopic": "Geodesy : 9.0 %", 
                "fillKey": "GRC"
            }, 
            "GRL": {
                "Maintopic": "Cryosphere : 66.7 %", 
                "Ncontributions": 9, 
                "Ncontributors": 5, 
                "Secondtopic": "Biogeosciences : 22.2 %", 
                "Thirdtopic": "Public Affairs : 11.1 %", 
                "fillKey": "GRL"
            }, 
            "GTM": {
                "Maintopic": "Global Environmental Change : 50.0 %", 
                "Ncontributions": 10, 
                "Ncontributors": 8, 
                "Secondtopic": "Public Affairs : 20.0 %", 
                "Thirdtopic": "Education : 10.0 %", 
                "fillKey": "GTM"
            }, 
            "GUF": {
                "Maintopic": "Biogeosciences : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "GUF"
            }, 
            "GUM": {
                "Maintopic": "Ocean Sciences : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "GUM"
            }, 
            "HKG": {
                "Maintopic": "Atmospheric Sciences : 23.8 %", 
                "Ncontributions": 101, 
                "Ncontributors": 82, 
                "Secondtopic": "Education : 17.8 %", 
                "Thirdtopic": "Hydrology : 15.8 %", 
                "fillKey": "HKG"
            }, 
            "HRV": {
                "Maintopic": "Geodesy : 75.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 4, 
                "Secondtopic": "Seismology : 25.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "HRV"
            }, 
            "HTI": {
                "Maintopic": "Public Affairs : 33.3 %", 
                "Ncontributions": 3, 
                "Ncontributors": 3, 
                "Secondtopic": "Atmospheric Sciences : 33.3 %", 
                "Thirdtopic": "Seismology : 33.3 %", 
                "fillKey": "HTI"
            }, 
            "HUN": {
                "Maintopic": "Planetary Sciences : 51.6 %", 
                "Ncontributions": 31, 
                "Ncontributors": 25, 
                "Secondtopic": "Geodesy : 16.1 %", 
                "Thirdtopic": "Biogeosciences : 9.7 %", 
                "fillKey": "HUN"
            }, 
            "IDN": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 21.3 %", 
                "Ncontributions": 94, 
                "Ncontributors": 74, 
                "Secondtopic": "Tectonophysics : 18.1 %", 
                "Thirdtopic": "Volcanology, Geochemistry and Petrology : 16.0 %", 
                "fillKey": "IDN"
            }, 
            "IND": {
                "Maintopic": "Atmospheric Sciences : 19.0 %", 
                "Ncontributions": 720, 
                "Ncontributors": 605, 
                "Secondtopic": "Hydrology : 18.5 %", 
                "Thirdtopic": "Global Environmental Change : 13.5 %", 
                "fillKey": "IND"
            }, 
            "IRL": {
                "Maintopic": "Tectonophysics : 18.6 %", 
                "Ncontributions": 86, 
                "Ncontributors": 54, 
                "Secondtopic": "Atmospheric Sciences : 17.4 %", 
                "Thirdtopic": "Seismology : 14.0 %", 
                "fillKey": "IRL"
            }, 
            "IRN": {
                "Maintopic": "Hydrology : 45.3 %", 
                "Ncontributions": 53, 
                "Ncontributors": 51, 
                "Secondtopic": "Global Environmental Change : 15.1 %", 
                "Thirdtopic": "Atmospheric Sciences : 11.3 %", 
                "fillKey": "IRN"
            }, 
            "IRQ": {
                "Maintopic": "Near Surface Geophysics : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "IRQ"
            }, 
            "ISL": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 23.9 %", 
                "Ncontributions": 176, 
                "Ncontributors": 69, 
                "Secondtopic": "Geodesy : 21.6 %", 
                "Thirdtopic": "Tectonophysics : 18.2 %", 
                "fillKey": "ISL"
            }, 
            "ISR": {
                "Maintopic": "Hydrology : 24.8 %", 
                "Ncontributions": 133, 
                "Ncontributors": 106, 
                "Secondtopic": "Atmospheric Sciences : 18.0 %", 
                "Thirdtopic": "Planetary Sciences : 9.8 %", 
                "fillKey": "ISR"
            }, 
            "ITA": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 14.7 %", 
                "Ncontributions": 1386, 
                "Ncontributors": 961, 
                "Secondtopic": "Planetary Sciences : 10.8 %", 
                "Thirdtopic": "Hydrology : 9.5 %", 
                "fillKey": "ITA"
            }, 
            "JAM": {
                "Maintopic": "Tectonophysics : 42.9 %", 
                "Ncontributions": 7, 
                "Ncontributors": 6, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 14.3 %", 
                "Thirdtopic": "Public Affairs : 14.3 %", 
                "fillKey": "JAM"
            }, 
            "JEY": {
                "Maintopic": "SPA-Magnetospheric Physics : 44.1 %", 
                "Ncontributions": 59, 
                "Ncontributors": 25, 
                "Secondtopic": "SPA-Solar and Heliospheric Physics : 20.3 %", 
                "Thirdtopic": "Atmospheric Sciences : 6.8 %", 
                "fillKey": "JEY"
            }, 
            "JOR": {
                "Maintopic": "Hydrology : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 9, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "JOR"
            }, 
            "JPN": {
                "Maintopic": "Atmospheric Sciences : 13.9 %", 
                "Ncontributions": 4038, 
                "Ncontributors": 2326, 
                "Secondtopic": "Tectonophysics : 13.2 %", 
                "Thirdtopic": "Seismology : 9.3 %", 
                "fillKey": "JPN"
            }, 
            "KAZ": {
                "Maintopic": "Atmospheric and Space Electricity : 42.1 %", 
                "Ncontributions": 19, 
                "Ncontributors": 16, 
                "Secondtopic": "Cryosphere : 26.3 %", 
                "Thirdtopic": "Union : 21.1 %", 
                "fillKey": "KAZ"
            }, 
            "KEN": {
                "Maintopic": "Global Environmental Change : 34.6 %", 
                "Ncontributions": 26, 
                "Ncontributors": 28, 
                "Secondtopic": "Biogeosciences : 23.1 %", 
                "Thirdtopic": "Hydrology : 15.4 %", 
                "fillKey": "KEN"
            }, 
            "KGZ": {
                "Maintopic": "Seismology : 50.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 5, 
                "Secondtopic": "Biogeosciences : 25.0 %", 
                "Thirdtopic": "Geomagnetism and Paleomagnetism : 25.0 %", 
                "fillKey": "KGZ"
            }, 
            "KHM": {
                "Maintopic": "Hydrology : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "KHM"
            }, 
            "KIR": {
                "Maintopic": "Ncontribs : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "SPA-Magnetospheric Physics : 0.0 %", 
                "Thirdtopic": "Biogeosciences : 0.0 %", 
                "fillKey": "KIR"
            }, 
            "KOR": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 100.0 %", 
                "Ncontributions": 6, 
                "Ncontributors": 6, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "KOR"
            }, 
            "KWT": {
                "Maintopic": "Seismology : 50.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 4, 
                "Secondtopic": "Earth and Planetary Surface Processes : 25.0 %", 
                "Thirdtopic": "Hydrology : 25.0 %", 
                "fillKey": "KWT"
            }, 
            "LAO": {
                "Maintopic": "Tectonophysics : 33.3 %", 
                "Ncontributions": 3, 
                "Ncontributors": 2, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 33.3 %", 
                "Thirdtopic": "Earth and Planetary Surface Processes : 33.3 %", 
                "fillKey": "LAO"
            }, 
            "LBN": {
                "Maintopic": "Hydrology : 87.5 %", 
                "Ncontributions": 8, 
                "Ncontributors": 10, 
                "Secondtopic": "Global Environmental Change : 12.5 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "LBN"
            }, 
            "LCA": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "LCA"
            }, 
            "LKA": {
                "Maintopic": "Biogeosciences : 40.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 5, 
                "Secondtopic": "Earth and Planetary Surface Processes : 40.0 %", 
                "Thirdtopic": "Hydrology : 20.0 %", 
                "fillKey": "LKA"
            }, 
            "LSO": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "LSO"
            }, 
            "LTU": {
                "Maintopic": "Atmospheric Sciences : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 3, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "LTU"
            }, 
            "LUX": {
                "Maintopic": "Hydrology : 41.8 %", 
                "Ncontributions": 55, 
                "Ncontributors": 33, 
                "Secondtopic": "Geodesy : 30.9 %", 
                "Thirdtopic": "Tectonophysics : 7.3 %", 
                "fillKey": "LUX"
            }, 
            "LVA": {
                "Maintopic": "Geodesy : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "LVA"
            }, 
            "MAR": {
                "Maintopic": "Earth and Planetary Surface Processes : 27.8 %", 
                "Ncontributions": 18, 
                "Ncontributors": 20, 
                "Secondtopic": "Near Surface Geophysics : 22.2 %", 
                "Thirdtopic": "Cryosphere : 11.1 %", 
                "fillKey": "MAR"
            }, 
            "MDG": {
                "Maintopic": "Tectonophysics : 46.2 %", 
                "Ncontributions": 13, 
                "Ncontributors": 8, 
                "Secondtopic": "Global Environmental Change : 23.1 %", 
                "Thirdtopic": "Geodesy : 15.4 %", 
                "fillKey": "MDG"
            }, 
            "MEX": {
                "Maintopic": "Volcanology, Geochemistry and Petrology : 12.0 %", 
                "Ncontributions": 885, 
                "Ncontributors": 558, 
                "Secondtopic": "Tectonophysics : 11.4 %", 
                "Thirdtopic": "Hydrology : 9.5 %", 
                "fillKey": "MEX"
            }, 
            "MKD": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "MKD"
            }, 
            "MLI": {
                "Maintopic": "Planetary Sciences : 48.0 %", 
                "Ncontributions": 25, 
                "Ncontributors": 24, 
                "Secondtopic": "SPA-Magnetospheric Physics : 40.0 %", 
                "Thirdtopic": "Natural Hazards : 8.0 %", 
                "fillKey": "MLI"
            }, 
            "MLT": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 75.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 3, 
                "Secondtopic": "Earth and Planetary Surface Processes : 25.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "MLT"
            }, 
            "MMR": {
                "Maintopic": "Seismology : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "MMR"
            }, 
            "MNG": {
                "Maintopic": "Tectonophysics : 60.0 %", 
                "Ncontributions": 25, 
                "Ncontributors": 19, 
                "Secondtopic": "Atmospheric Sciences : 20.0 %", 
                "Thirdtopic": "Paleoceanography and Paleoclimatology : 12.0 %", 
                "fillKey": "MNG"
            }, 
            "MOZ": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "MOZ"
            }, 
            "MSR": {
                "Maintopic": "Geodesy : 50.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Seismology : 50.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "MSR"
            }, 
            "MWI": {
                "Maintopic": "Tectonophysics : 54.2 %", 
                "Ncontributions": 24, 
                "Ncontributors": 7, 
                "Secondtopic": "Education : 37.5 %", 
                "Thirdtopic": "Natural Hazards : 4.2 %", 
                "fillKey": "MWI"
            }, 
            "MYS": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 31.2 %", 
                "Ncontributions": 16, 
                "Ncontributors": 18, 
                "Secondtopic": "Natural Hazards : 31.2 %", 
                "Thirdtopic": "Atmospheric Sciences : 12.5 %", 
                "fillKey": "MYS"
            }, 
            "MYT": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "MYT"
            }, 
            "NAM": {
                "Maintopic": "Tectonophysics : 42.9 %", 
                "Ncontributions": 7, 
                "Ncontributors": 10, 
                "Secondtopic": "Hydrology : 28.6 %", 
                "Thirdtopic": "Biogeosciences : 14.3 %", 
                "fillKey": "NAM"
            }, 
            "NCL": {
                "Maintopic": "Tectonophysics : 44.4 %", 
                "Ncontributions": 9, 
                "Ncontributors": 8, 
                "Secondtopic": "Seismology : 33.3 %", 
                "Thirdtopic": "Geodesy : 22.2 %", 
                "fillKey": "NCL"
            }, 
            "NER": {
                "Maintopic": "Global Environmental Change : 50.0 %", 
                "Ncontributions": 36, 
                "Ncontributors": 37, 
                "Secondtopic": "SPA-Aeronomy : 25.0 %", 
                "Thirdtopic": "Education : 8.3 %", 
                "fillKey": "NER"
            }, 
            "NIC": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "NIC"
            }, 
            "NLD": {
                "Maintopic": "Hydrology : 21.6 %", 
                "Ncontributions": 864, 
                "Ncontributors": 531, 
                "Secondtopic": "Atmospheric Sciences : 12.6 %", 
                "Thirdtopic": "Cryosphere : 7.9 %", 
                "fillKey": "NLD"
            }, 
            "NOR": {
                "Maintopic": "Cryosphere : 13.6 %", 
                "Ncontributions": 587, 
                "Ncontributors": 412, 
                "Secondtopic": "Tectonophysics : 12.3 %", 
                "Thirdtopic": "Atmospheric Sciences : 9.7 %", 
                "fillKey": "NOR"
            }, 
            "NPL": {
                "Maintopic": "Seismology : 26.5 %", 
                "Ncontributions": 68, 
                "Ncontributors": 55, 
                "Secondtopic": "Global Environmental Change : 19.1 %", 
                "Thirdtopic": "Cryosphere : 16.2 %", 
                "fillKey": "NPL"
            }, 
            "NZL": {
                "Maintopic": "Tectonophysics : 28.6 %", 
                "Ncontributions": 636, 
                "Ncontributors": 367, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 9.6 %", 
                "Thirdtopic": "Paleoceanography and Paleoclimatology : 7.9 %", 
                "fillKey": "NZL"
            }, 
            "OMN": {
                "Maintopic": "Atmospheric Sciences : 25.0 %", 
                "Ncontributions": 52, 
                "Ncontributors": 45, 
                "Secondtopic": "Hydrology : 13.5 %", 
                "Thirdtopic": "Global Environmental Change : 13.5 %", 
                "fillKey": "OMN"
            }, 
            "PAK": {
                "Maintopic": "SPA-Solar and Heliospheric Physics : 35.7 %", 
                "Ncontributions": 14, 
                "Ncontributors": 14, 
                "Secondtopic": "Tectonophysics : 21.4 %", 
                "Thirdtopic": "Mineral and Rock Physics : 21.4 %", 
                "fillKey": "PAK"
            }, 
            "PAN": {
                "Maintopic": "Biogeosciences : 75.0 %", 
                "Ncontributions": 16, 
                "Ncontributors": 12, 
                "Secondtopic": "Hydrology : 12.5 %", 
                "Thirdtopic": "Tectonophysics : 6.2 %", 
                "fillKey": "PAN"
            }, 
            "PER": {
                "Maintopic": "Ocean Sciences : 18.6 %", 
                "Ncontributions": 43, 
                "Ncontributors": 38, 
                "Secondtopic": "Atmospheric Sciences : 11.6 %", 
                "Thirdtopic": "Tectonophysics : 9.3 %", 
                "fillKey": "PER"
            }, 
            "PHL": {
                "Maintopic": "Biogeosciences : 17.5 %", 
                "Ncontributions": 57, 
                "Ncontributors": 53, 
                "Secondtopic": "Natural Hazards : 17.5 %", 
                "Thirdtopic": "Tectonophysics : 15.8 %", 
                "fillKey": "PHL"
            }, 
            "PLW": {
                "Maintopic": "Public Affairs : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Union : 0.0 %", 
                "fillKey": "PLW"
            }, 
            "POL": {
                "Maintopic": "SPA-Solar and Heliospheric Physics : 21.9 %", 
                "Ncontributions": 128, 
                "Ncontributors": 92, 
                "Secondtopic": "Natural Hazards : 11.7 %", 
                "Thirdtopic": "Geodesy : 10.2 %", 
                "fillKey": "POL"
            }, 
            "PRI": {
                "Maintopic": "Hydrology : 28.9 %", 
                "Ncontributions": 45, 
                "Ncontributors": 34, 
                "Secondtopic": "Atmospheric Sciences : 22.2 %", 
                "Thirdtopic": "Tectonophysics : 15.6 %", 
                "fillKey": "PRI"
            }, 
            "PRK": {
                "Maintopic": "Atmospheric Sciences : 26.2 %", 
                "Ncontributions": 1591, 
                "Ncontributors": 1040, 
                "Secondtopic": "Hydrology : 15.2 %", 
                "Thirdtopic": "Biogeosciences : 9.1 %", 
                "fillKey": "PRK"
            }, 
            "PRT": {
                "Maintopic": "Natural Hazards : 29.9 %", 
                "Ncontributions": 77, 
                "Ncontributors": 56, 
                "Secondtopic": "Seismology : 16.9 %", 
                "Thirdtopic": "Earth and Planetary Surface Processes : 11.7 %", 
                "fillKey": "PRT"
            }, 
            "PSE": {
                "Maintopic": "Seismology : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "PSE"
            }, 
            "PYF": {
                "Maintopic": "Hydrology : 50.0 %", 
                "Ncontributions": 6, 
                "Ncontributors": 5, 
                "Secondtopic": "Planetary Sciences : 33.3 %", 
                "Thirdtopic": "Seismology : 16.7 %", 
                "fillKey": "PYF"
            }, 
            "QAT": {
                "Maintopic": "Ocean Sciences : 58.8 %", 
                "Ncontributions": 17, 
                "Ncontributors": 14, 
                "Secondtopic": "Global Environmental Change : 23.5 %", 
                "Thirdtopic": "Hydrology : 11.8 %", 
                "fillKey": "QAT"
            }, 
            "REU": {
                "Maintopic": "Biogeosciences : 100.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "REU"
            }, 
            "RUS": {
                "Maintopic": "Cryosphere : 15.5 %", 
                "Ncontributions": 401, 
                "Ncontributors": 305, 
                "Secondtopic": "Global Environmental Change : 13.0 %", 
                "Thirdtopic": "Tectonophysics : 11.0 %", 
                "fillKey": "RUS"
            }, 
            "RWA": {
                "Maintopic": "Biogeosciences : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 3, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "RWA"
            }, 
            "SAU": {
                "Maintopic": "Tectonophysics : 26.9 %", 
                "Ncontributions": 67, 
                "Ncontributors": 41, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 19.4 %", 
                "Thirdtopic": "Seismology : 13.4 %", 
                "fillKey": "SAU"
            }, 
            "SEN": {
                "Maintopic": "Hydrology : 71.4 %", 
                "Ncontributions": 7, 
                "Ncontributors": 8, 
                "Secondtopic": "Global Environmental Change : 28.6 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "SEN"
            }, 
            "SGP": {
                "Maintopic": "Tectonophysics : 30.0 %", 
                "Ncontributions": 233, 
                "Ncontributors": 108, 
                "Secondtopic": "Seismology : 17.6 %", 
                "Thirdtopic": "Volcanology, Geochemistry and Petrology : 10.3 %", 
                "fillKey": "SGP"
            }, 
            "SLB": {
                "Maintopic": "Tectonophysics : 75.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 2, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 25.0 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "SLB"
            }, 
            "SLV": {
                "Maintopic": "Public Affairs : 50.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 3, 
                "Secondtopic": "Volcanology, Geochemistry and Petrology : 50.0 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "SLV"
            }, 
            "SRB": {
                "Maintopic": "Hydrology : 57.1 %", 
                "Ncontributions": 7, 
                "Ncontributors": 9, 
                "Secondtopic": "SPA-Solar and Heliospheric Physics : 28.6 %", 
                "Thirdtopic": "Atmospheric Sciences : 14.3 %", 
                "fillKey": "SRB"
            }, 
            "SVK": {
                "Maintopic": "Geodesy : 60.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 6, 
                "Secondtopic": "Geomagnetism and Paleomagnetism : 40.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "SVK"
            }, 
            "SVN": {
                "Maintopic": "Global Environmental Change : 55.6 %", 
                "Ncontributions": 9, 
                "Ncontributors": 8, 
                "Secondtopic": "Biogeosciences : 44.4 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "SVN"
            }, 
            "SWE": {
                "Maintopic": "Biogeosciences : 16.0 %", 
                "Ncontributions": 800, 
                "Ncontributors": 433, 
                "Secondtopic": "SPA-Magnetospheric Physics : 15.8 %", 
                "Thirdtopic": "Cryosphere : 15.1 %", 
                "fillKey": "SWE"
            }, 
            "SWZ": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 1, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "SWZ"
            }, 
            "SYC": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "SYC"
            }, 
            "SYR": {
                "Maintopic": "Paleoceanography and Paleoclimatology : 50.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Seismology : 50.0 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "SYR"
            }, 
            "TCD": {
                "Maintopic": "Global Environmental Change : 100.0 %", 
                "Ncontributions": 3, 
                "Ncontributors": 4, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "TCD"
            }, 
            "TGO": {
                "Maintopic": "Global Environmental Change : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "TGO"
            }, 
            "THA": {
                "Maintopic": "SPA-Solar and Heliospheric Physics : 18.4 %", 
                "Ncontributions": 49, 
                "Ncontributors": 40, 
                "Secondtopic": "Atmospheric Sciences : 12.2 %", 
                "Thirdtopic": "Hydrology : 10.2 %", 
                "fillKey": "THA"
            }, 
            "TJK": {
                "Maintopic": "Tectonophysics : 100.0 %", 
                "Ncontributions": 4, 
                "Ncontributors": 2, 
                "Secondtopic": "Nonlinear Geophysics : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "TJK"
            }, 
            "TTO": {
                "Maintopic": "Seismology : 56.2 %", 
                "Ncontributions": 16, 
                "Ncontributors": 13, 
                "Secondtopic": "Tectonophysics : 18.8 %", 
                "Thirdtopic": "Natural Hazards : 18.8 %", 
                "fillKey": "TTO"
            }, 
            "TUN": {
                "Maintopic": "Tectonophysics : 60.0 %", 
                "Ncontributions": 10, 
                "Ncontributors": 13, 
                "Secondtopic": "Paleoceanography and Paleoclimatology : 30.0 %", 
                "Thirdtopic": "Hydrology : 10.0 %", 
                "fillKey": "TUN"
            }, 
            "TUR": {
                "Maintopic": "Natural Hazards : 26.6 %", 
                "Ncontributions": 192, 
                "Ncontributors": 170, 
                "Secondtopic": "Geodesy : 15.6 %", 
                "Thirdtopic": "Tectonophysics : 15.1 %", 
                "fillKey": "TUR"
            }, 
            "TWN": {
                "Maintopic": "Tectonophysics : 18.1 %", 
                "Ncontributions": 800, 
                "Ncontributors": 554, 
                "Secondtopic": "Hydrology : 16.4 %", 
                "Thirdtopic": "Natural Hazards : 9.2 %", 
                "fillKey": "TWN"
            }, 
            "TZA": {
                "Maintopic": "Tectonophysics : 75.0 %", 
                "Ncontributions": 40, 
                "Ncontributors": 17, 
                "Secondtopic": "Biogeosciences : 22.5 %", 
                "Thirdtopic": "Global Environmental Change : 2.5 %", 
                "fillKey": "TZA"
            }, 
            "UGA": {
                "Maintopic": "Biogeosciences : 50.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 2, 
                "Secondtopic": "Tectonophysics : 50.0 %", 
                "Thirdtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "fillKey": "UGA"
            }, 
            "UKR": {
                "Maintopic": "Planetary Sciences : 26.3 %", 
                "Ncontributions": 19, 
                "Ncontributors": 18, 
                "Secondtopic": "SPA-Magnetospheric Physics : 21.1 %", 
                "Thirdtopic": "SPA-Aeronomy : 21.1 %", 
                "fillKey": "UKR"
            }, 
            "URY": {
                "Maintopic": "Earth and Planetary Surface Processes : 70.0 %", 
                "Ncontributions": 10, 
                "Ncontributors": 8, 
                "Secondtopic": "Hydrology : 20.0 %", 
                "Thirdtopic": "Tectonophysics : 10.0 %", 
                "fillKey": "URY"
            }, 
            "USA": {
                "Maintopic": "Atmospheric Sciences : 15.6 %", 
                "Ncontributions": 56041, 
                "Ncontributors": 26897, 
                "Secondtopic": "Hydrology : 11.1 %", 
                "Thirdtopic": "Biogeosciences : 10.2 %", 
                "fillKey": "USA"
            }, 
            "UZB": {
                "Maintopic": "Hydrology : 100.0 %", 
                "Ncontributions": 1, 
                "Ncontributors": 2, 
                "Secondtopic": "Study of Earth's Deep Interior : 0.0 %", 
                "Thirdtopic": "Public Affairs : 0.0 %", 
                "fillKey": "UZB"
            }, 
            "VEN": {
                "Maintopic": "Tectonophysics : 66.7 %", 
                "Ncontributions": 6, 
                "Ncontributors": 5, 
                "Secondtopic": "Biogeosciences : 16.7 %", 
                "Thirdtopic": "Near Surface Geophysics : 16.7 %", 
                "fillKey": "VEN"
            }, 
            "VGB": {
                "Maintopic": "Nonlinear Geophysics : nan %", 
                "Ncontributions": 0, 
                "Ncontributors": 1, 
                "Secondtopic": "Public Affairs : nan %", 
                "Thirdtopic": "Union : nan %", 
                "fillKey": "VGB"
            }, 
            "VNM": {
                "Maintopic": "Global Environmental Change : 29.6 %", 
                "Ncontributions": 27, 
                "Ncontributors": 28, 
                "Secondtopic": "Earth and Planetary Surface Processes : 18.5 %", 
                "Thirdtopic": "Tectonophysics : 11.1 %", 
                "fillKey": "VNM"
            }, 
            "VUT": {
                "Maintopic": "Natural Hazards : 60.0 %", 
                "Ncontributions": 5, 
                "Ncontributors": 5, 
                "Secondtopic": "Seismology : 40.0 %", 
                "Thirdtopic": "SPA-Magnetospheric Physics : 0.0 %", 
                "fillKey": "VUT"
            }, 
            "ZAF": {
                "Maintopic": "Biogeosciences : 11.5 %", 
                "Ncontributions": 96, 
                "Ncontributors": 86, 
                "Secondtopic": "Tectonophysics : 10.4 %", 
                "Thirdtopic": "Planetary Sciences : 7.3 %", 
                "fillKey": "ZAF"
            }, 
            "ZMB": {
                "Maintopic": "Tectonophysics : 66.7 %", 
                "Ncontributions": 3, 
                "Ncontributors": 3, 
                "Secondtopic": "Global Environmental Change : 33.3 %", 
                "Thirdtopic": "Nonlinear Geophysics : 0.0 %", 
                "fillKey": "ZMB"
            }, 
            "ZWE": {
                "Maintopic": "Ncontribs : 100.0 %", 
                "Ncontributions": 2, 
                "Ncontributors": 4, 
                "Secondtopic": "SPA-Magnetospheric Physics : 0.0 %", 
                "Thirdtopic": "Biogeosciences : 0.0 %", 
                "fillKey": "ZWE"
            }
        },
    geographyConfig: {
        popupTemplate: function(geography, data) {
            return ['<div class="hoverinfo">' + geography.properties.name,
                    '<br/>Nb of contributors :' + data.Ncontributors,
                    '<br/>Nb of contributions :' + data.Ncontributions,
                    '<br/>Main topic :' + data.Maintopic,
                    '<br/>Secon topic :' + data.Secondtopic,
                    '<br/>Third topic :' + data.Thirdtopic,
                    '<\div>'].join('')
        },
        highlightBorderWidth: 3
    }
    }
);
