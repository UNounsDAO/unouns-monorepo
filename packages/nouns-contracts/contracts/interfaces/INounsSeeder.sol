// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsSeeder

/*******************************************************************************
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╩╩╠▒▒▒▒▒╠╩╩╩╩               ╩╩╩╩╠▒▒▒▒▒╠╩╩▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╠╩╩  ╠▒╩╩╩╩ε    ▒▒▒▒▒▒  )▒▒▒▒▒▒    ╚╩╩╩╠▒▒  ╩╩▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒╠╩╩▒▒  ▒▒╩╩    ]▒▒▒▒╩╩╩╩╩╩  ╘╩╩╩╩╩╩▒▒▒▒    ,╩╩▒▒  ▒▒╩╩╠▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒Γ  ╚╚▒▒╚╚,,╚▒▒▒╩╚╚╚╚,,,,,,  .,,,,,,╚╚╚╚╠▒▒▒≥,,╚╚▒▒╚╚  ╙▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒,,,,▒▒  ╠▒▒▒╩╚.,,,,▒▒▒▒▒▒  )▒▒▒▒▒▒,,,,╙╚╠▒▒▒╡  ▒▒,,,,╚▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒╚╚╠▒╩╚╚▒╠╚╚,,╠▒╚╚½,╔▒▒▒▒▒▒╚╚╚╚  ╘╚╚╚╚▒▒▒▒▒▒,,²╚╚▒▒,,╚╚▒▒╚╚╠▒╩╚╚▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒  ²╚\,,▒Γ  ▒▒▒▒  ]▒▒▒▒▒▒╚╚,,,,  .,,,,╚╚▒▒▒▒▒▒  ]▒▒▒▒  ▒▒,,²╚⌐  ▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒,,,,╓▒╠╚╙,,▒▒╚╚,,]▒▒▒╠╚╚,,╠▒▒▒  )▒▒▒▒,,╚╚╠▒▒▒,,/╚╚▒▒,,╚╚╠▒,,,,,▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒""╠▒╙"╙▒╡  ▒▒▒▒  ▐▒▒▒▒▒▒╓╓▒▒▒▒▒▒  ▐▒▒▒▒▒▒╓╓╢▒▒▒▒▒Γ  ▒▒▒▒  ╠▒╙"╙▒╠"╙▒▒▒▒▒▒
▒▒▒▒▒▒▒╓╓""  ]▒╡  """"  ""╚╬╩╙╙╙╙████╬╬  ║╬╬╙╙╙╙▓███╬╬╙"¬  """"  ╠▒  '"└╓╓▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒╓╓╓╓φ▒╡  ╓╓╓╓╓╓╓╓▄╬Γ    ████▓╬╥╓║╬▌    ████╬╬╦╓   ╓╓╓-  ╠▒╓╓╓╓╓▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒""╠▒╙"╙▒╡  ▒▒╬╬╜╙╠╬╣╬Γ    ████▓╬╨╙╟╬▌    ████╬╬▒▒Γ  ▒▒▒▒  ╠▒╙"╙▒╠"╙▒▒▒▒▒▒
▒▒▒▒▒▒▒╓╓""  ]▒╡  ▒▒╬╬  ▐▒╟╬Γ    ████▓╬  ║╬▌    ████╬╬▒▒Γ  ▒▒▒▒  ╠▒  '"└╓╓▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒╔╔╔╔φ▒▒╔ε``╠╠╔╔``▐╬▒╗╗╗╗████▒╬  ║╬▌╗╗╗╗████╬╬▒`]╔╔▒▒``╔╔╠▒╔╔╔╔╔▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒``╚▒╩`"▒Γ  ▒▒▒▒  ]╠╠╠╠╠╠╠╠╙╙╙╙  ^╙╙╙╙╠╠╠╠╠╠╠╠  ]▒▒▒▒  ▒▒``╠▒╙`"▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒╔╔```  ▒╠╔╔``╠▒╔╔ε`╚▒▒▒▒▒▒╔╔╔╔  «╔╔╔╔▒▒▒▒▒▒``╔╔φ▒╠``╔╔▒▒  ``]╔╔▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒╔╔╔╔╔▒▒▒▒  ╠▒▒▒╦╔⌂````▒▒▒▒▒▒  )▒▒▒▒▒▒````╔╔╠▒▒▒╡  ▒▒▒▒╔╔╔╔φ▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒╙`7▒▒`"▒▒╔╔``╚▒▒▒╦╔╔╔╔``````  ```````╔╔╔╔╠▒▒▒╙`"╔╔▒▒``╠▒"`╙▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒╔╔ε``  ▒▒▒▒╔╔"```╚▒▒▒▒╔╔╔╔╔╔  «╔╔╔╔╔╔▒▒▒▒````]╔╔▒▒▒▒  ``╔╔φ▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒╠φφφφ▒▒  ╠▒φφφφ░    ▒▒▒▒▒▒  )▒▒▒▒▒▒    ╔φφφφ▒╠  ▒▒φφφφ╠▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╠    ╠▒▒▒▒▒φφφφφ               φφφφ╠▒▒▒▒▒╡    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╠φφφφ╠▒▒▒▒▒▒▒▒▒▒φφφφφφφφφφφφφφφ▒▒▒▒▒▒▒▒▒▒╠φφφφ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░        ╠▒▒▒▒▒Γ        ╠▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░   ]φφφφφφφφ      `φφφφφφφφ    ]▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╠▒▒▒▒▒▒  ╔▒▒▒▒▒Γ  ▒▒▒▒▒▒▒▒▒▒╠▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒Γ    δ▒╠▒▒▒▒▒╠▒φ    ╠▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╠▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒╠▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
*******************************************************************************/


pragma solidity ^0.8.6;

import { INounsDescriptorMinimal } from './INounsDescriptorMinimal.sol';

interface INounsSeeder {
    struct Seed {
        uint48 background;
        uint48 body;
        uint48 accessory;
        uint48 head;
        uint48 glasses;
    }

    function generateSeed(uint256 unounId, INounsDescriptorMinimal descriptor) external view returns (Seed memory);
}
