// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsToken

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

import { IERC721 } from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import { INounsDescriptorMinimal } from './INounsDescriptorMinimal.sol';
import { INounsSeeder } from './INounsSeeder.sol';

interface INounsToken is IERC721 {
    event NounCreated(uint256 indexed tokenId, INounsSeeder.Seed seed);

    event NounBurned(uint256 indexed tokenId);

    event NoundersDAOUpdated(address noundersDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(INounsDescriptorMinimal descriptor);

    event DescriptorLocked();

    event SeederUpdated(INounsSeeder seeder);

    event SeederLocked();

    function mint() external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    function setUNoundersDAO(address noundersDAO) external;

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(INounsDescriptorMinimal descriptor) external;

    function lockDescriptor() external;

    function setSeeder(INounsSeeder seeder) external;

    function lockSeeder() external;
}
