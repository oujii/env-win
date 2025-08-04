// Search suggestions data for different input states
const searchSuggestions = {
    "o": [
        { type: "search", text: "outlook" },
        { type: "search", text: "other stories" },
        { type: "entity", text: "OKQ8", description: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQryX0EKI0WQzNVpJ3sEPJXe0pf7fvCRTyBa-nntoBG&s=10" },
        { type: "search", text: "omni" },
        { type: "search", text: "ozempic" },
        { type: "search", text: "our legacy" },
        { type: "entity", text: "Ola Salo", description: "Svensk låtskrivare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI-v_t5-Y-v7vtUyNcNQsqQz0_jHJgCkay6G4DHJTXSUD6yxQynwNY5AYKKg&s=10" },
        { type: "search", text: "ola love is blind" },
        { type: "entity", text: "operan", description: "Kungliga Operan · Gustav Adolfs torg 2, Stockholm", image: "https://lh3.googleusercontent.com/p/AF1QipNLQssalcvUZpYxCV9_xi9SCQSdzu_a80ZH3SyG=w92-h92-n-k-no" },
        { type: "search", text: "office 365" }
    ],
    "ol": [
        { type: "entity", text: "Ola Salo", description: "Svensk låtskrivare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI-v_t5-Y-v7vtUyNcNQsqQz0_jHJgCkay6G4DHJTXSUD6yxQynwNY5AYKKg&s=10" },
        { type: "search", text: "ola love is blind" },
        { type: "entity", text: "Olli Ristorante", description: "Restaurang · Jakobsbergsgatan 21, Stockholm", image: "https://lh3.googleusercontent.com/p/AF1QipOpu3-zoTl8_EuFUW1iX45BqINyma7oQ0ubKepR=w92-h92-n-k-no" },
        { type: "entity", text: "Olof Palme", description: "F.d. Sveriges statsminister", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2LSyqYy8_lS5_d2R_33ZS6X9e7V0CBLDWToj-DSK7VOWko7wWLizBWqKm6L0&s=10" },
        { type: "search", text: "oljemagasinet" },
        { type: "entity", text: "Olle Sarri", description: "Svensk skådespelare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS830wXUa7MN8jStqoGxx8w2-JImiJKmO-lOqmrRkTLy_Zbj2lJ1Ku1tiH8dg&s=10" },
        { type: "entity", text: "Olli Jokinen", description: "Finländsk ishockeytränare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHx8h-9aj5uiIH_sN-muVZ0bZMe5z8-H03NJtsV9QMsQ&s=10" },
        { type: "entity", text: "OIO Olo", description: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiTMpZeIHzyg1DbnYG9SQYLa3F98P2qU9tPZw5_eMFLQ&s=10" },
        { type: "search", text: "olycka kebnekaise" },
        { type: "entity", text: "Ola Jonsson", description: "F.d. tennisspelare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHx8h-9aj5uiIH_sN-muVZ0bZMe5z8-H03NJtsV9QMsQ&s=10" }
    ],
    "oll": [
        { type: "entity", text: "Olli Ristorante", description: "Restaurang · Jakobsbergsgatan 21, Stockholm", image: "https://lh3.googleusercontent.com/p/AF1QipOpu3-zoTl8_EuFUW1iX45BqINyma7oQ0ubKepR=w92-h92-n-k-no" },
        { type: "entity", text: "Olli Jokinen", description: "Finländsk ishockeytränare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL--4fjtv4LmA0mg3tP5vWxjeUMBCo3xlPKciCNy_tWPq0V5oWiXZbcZi3oA&s=10" },
        { type: "search", text: "olli jokinen timrå" },
        { type: "entity", text: "Olle Ljungström", description: "Svensk sångare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsKyeJLtK4HhVHYd3sFHiPe1IKnuKMC3uYJUP7m9Lq-g&s=10" },
        { type: "entity", text: "Olle Palmlöf", description: "Svensk tv-programledare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi523b1LKR_62g5ljUHE0Gw7A5amfyhMKstDyT1xJFnUKmMdit5K4VDWew-g&s=10" },
        { type: "entity", text: "Olle Jönsson", description: "Svensk sångare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROX7HGdc882Jy8BXzdoIkcLGu326thEkEV6j2U-O2Nag&s=10" },
        { type: "search", text: "ollama" },
        { type: "entity", text: "Olle Olsson Hagalund-museet", description: "Konstmuseum · Spetsgatan 2, Solna", image: "https://lh3.googleusercontent.com/p/AF1QipOPUY8hKMwi9F_4pwiOrfu91Sa8wjPvvUAAgg2u=w92-h92-n-k-no" },
        { type: "entity", text: "Olle Strandell", description: "Svensk ishockeyspelare", image: "" },
        { type: "entity", text: "olles kiosk", description: "Postombud på Olles Kiosk · Viksjöplan 39, Järfälla", image: "" }
    ],
    "olle": [
        { type: "entity", text: "Olle Ljungström", description: "Svensk sångare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsKyeJLtK4HhVHYd3sFHiPe1IKnuKMC3uYJUP7m9Lq-g&s=10" },
        { type: "entity", text: "Olle Palmlöf", description: "Svensk tv-programledare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRav3mGjYb5ssB54Zzol3T3N5K8wKqJPNvxTgQ89ZWL07AQuUu53J_cGO5irw&s=10" },
        { type: "entity", text: "Olle Jönsson", description: "Svensk sångare", image: "https://lh3.googleusercontent.com/p/AF1QipN7zNLY8GxxXkr_9ZY5dBIKI1bTqwYlvLDKpVZi=w92-h92-n-k-no" },
        { type: "entity", text: "Olle Olsson Hagalund-museet", description: "Konstmuseum · Spetsgatan 2, Solna", image: "https://lh3.googleusercontent.com/p/AF1QipOPUY8hKMwi9F_4pwiOrfu91Sa8wjPvvUAAgg2u=w92-h92-n-k-no" },
        { type: "entity", text: "Olle Strandell", description: "Svensk ishockeyspelare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi523b1LKR_62g5ljUHE0Gw7A5amfyhMKstDyT1xJFnUKmMdit5K4VDWew-g&s=10" },
        { type: "entity", text: "olles kiosk", description: "Postombud på Olles Kiosk · Viksjöplan 39, Järfälla", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsKyeJLtK4HhVHYd3sFHiPe1IKnuKMC3uYJUP7m9Lq-g&s=10" },
        { type: "entity", text: "Olle Adolphson", description: "Svensk visdiktare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgF-H81t6B4pyVAG-cB-i2BBHYA88NjudW62KdDlq8VA&s=10" },
        { type: "entity", text: "Olle Nyman", description: "Svensk företagsledare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqgbjnbQx_EQEgta3CpQ1tGp8LxAKsYQZVIojNx7p7YW52DXj9FIvHHNGtxqc&s=10" },
        { type: "entity", text: "Olle Alsing", description: "Svensk ishockeyspelare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgbznlztFPPDbML2-zhSUiz82ch-eYmrZPJTnPiMeLflNgHBEIbkhK1TFG1A&s=10" },
        { type: "entity", text: "Olle Hellbom", description: "", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhvfoLxDTxVM20HKi1OfplGisCd1z0NiJshJnE6W9jRA4hlL_hbOoAwY1hlg&s=10" }
    ],
    "olle b": [
        { type: "entity", text: "Olle Bærtling", description: "Svensk målare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdQMVOTxD2OZTYtXAcGkuE3m0GMPTfuy0PwedYXG4K-fYTsttlovbbX3UOeQ&s=10" },
        { type: "entity", text: "Olle Burell", description: "Politiker", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI_6x2cx0-ggroojL2qf8xyIrOm1WnjnDVZqGBbLCpzhsWZCGMycgrym-ozw&s=10" },
        { type: "search", text: "olle berg gräsmatta" },
        { type: "entity", text: "Olle Bonniér", description: "Svensk målare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmrC5Q6Dc62-6_mImq--2kUQjVOHgNjdPw58jxE87huEvGujdgI7YLMxzAOA&s=10" },
        { type: "entity", text: "Olle Björklund", description: "Svensk skådespelare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiVXIdWIZIN6vBDqmI77bF8stftR8KhBjuQAWfwcZ_RT53ZMWFkil6o01knA&s=10" },
        { type: "search", text: "olle baertling till salu" },
        { type: "search", text: "olle bäst i test" },
        { type: "entity", text: "Olle Björling", description: "Svensk skådespelare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqmvRCBofTtuyFegU2EWCJpOTd1m-GuTwij5FwB8lVcZ9oWLORDkNjc5z7rA&s=10" },
        { type: "search", text: "olle brickstad" },
        { type: "search", text: "olle bengtsson" }
    ],
    "olle be": [
        { type: "search", text: "olle berg" },
        { type: "search", text: "olle bengtsson" },
        { type: "search", text: "olle betydelse" },
        { type: "entity", text: "Olle Bergman", description: "Svensk sångare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt1pc_PKyoCw8F6Wl3BgSb8SGwloAHmhZ2DRQEcEB8gg&s=10" },
        { type: "search", text: "olle bertfelt" },
        { type: "entity", text: "Olle Bærtling", description: "Svensk målare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdQMVOTxD2OZTYtXAcGkuE3m0GMPTfuy0PwedYXG4K-fYTsttlovbbX3UOeQ&s=10" },
        { type: "search", text: "olle bengtzon priset" },
        { type: "search", text: "olle bergvall" },
        { type: "search", text: "olle bergström" },
        { type: "entity", text: "Olle Berglund", description: "TV-producent", image: "" }
    ],
    "olle bengts": [
        { type: "search", text: "olle bengtsson" },
        { type: "search", text: "olle bengtsson svt" },
        { type: "search", text: "olle bengtsson hallaryd" },
        { type: "search", text: "olle bengtsson rönninge" },
        { type: "search", text: "olle bengtström" },
        { type: "search", text: "olle bengtsson falun" },
        { type: "search", text: "olle bengtsson stockholm" },
        { type: "search", text: "olle bengtsson kristianstad" },
        { type: "search", text: "olle bengtsson växjö" },
        { type: "search", text: "olle bengtsson söderhamn" }
    ],
    "olle bengtsson": [
        { type: "search", text: "olle bengtsson franz jäger" },
        { type: "search", text: "olle bengtsson säkerhetsexpert" },
        { type: "search", text: "olle bengtsson linkedin" },
        { type: "search", text: "olle bengtsson kontakt" },
        { type: "search", text: "olle bengtsson låssystem" },
        { type: "search", text: "olle bengtsson föreläsning" },
        { type: "search", text: "olle bengtsson teknisk chef" },
        { type: "search", text: "olle bengtsson stockholm" },
        { type: "search", text: "olle bengtsson säkerhetslösningar" }
    ]
};
