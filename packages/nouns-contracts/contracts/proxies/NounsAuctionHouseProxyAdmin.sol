// SPDX-License-Identifier: GPL-3.0

/// @title The UNouns DAO auction house proxy admin

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

import { ProxyAdmin } from '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol';

// prettier-ignore
contract NounsAuctionHouseProxyAdmin is ProxyAdmin {}
