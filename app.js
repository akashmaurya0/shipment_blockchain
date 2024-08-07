

function validateForm() {
    const receiver = document.getElementById("receiver-address").value;
    const pickupTime = document.getElementById("pickup-time").value;
    const distance = document.getElementById("distance").value;
    const price = document.getElementById("price").value;
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerHTML = "";

    if (receiver === "") {
        errorMessage.innerHTML = "Receiver Address is required.";
        return false;
    }

    if (pickupTime === "") {
        errorMessage.innerHTML = "Pickup Time is required.";
        return false;
    }

    if (distance === "" || isNaN(distance) || distance <= 0) {
        errorMessage.innerHTML = "Valid Distance is required.";
        return false;
    }

    if (price === "" || isNaN(price) || price <= 0) {
        errorMessage.innerHTML = "Valid Price is required.";
        return false;
    }

    createShipment();
}

// Initialize Web3
let web3;
if (window.ethereum) {
	// use the injected Ethereum provider to initialize Web3.js
	web3 = new Web3(window.ethereum);

	// check if Ethereum provider comes from MetaMask
	if (window.ethereum.isMetaMask) {
	  console.log("Connected to Ethereum with MetaMask.");
		
	} else {
		console.log("Non-MetaMask Ethereum provider detected.");
	}
}




web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

// Contract details
const contractAddress = "0xf09611554ac91890108179b799b310645f4868ab";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_pickupTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_distance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "createShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "forDev",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shipmentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "ShipmentCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "shipmentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "status",
				"type": "uint256"
			}
		],
		"name": "ShipmentStatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_shipmentId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_status",
				"type": "uint256"
			}
		],
		"name": "updateShipmentStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllShipments",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "pickupTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "distance",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "status",
						"type": "uint256"
					}
				],
				"internalType": "struct SupplyChain.Shipment[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "shipments",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "pickupTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "distance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "status",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

let contract;

// Connect to wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById("connect-wallet").innerHTML = `<p>wallet Address: </p> ${account}`;
            
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Error connecting wallet. Check console for details.");
        }
		// setTimeout(() => {
		// 	loadShipments();
		// }, 1000);
		
    } else {
        alert("Please install MetaMask to use this feature.");
    }
}

// Create shipment
async function createShipment() {
    const receiver = document.getElementById("receiver-address").value;
    const pickupTime = new Date(document.getElementById("pickup-time").value).getTime() / 1000; // Convert to seconds
    const distance = document.getElementById("distance").value;
    // const price = web3.utils.toWei(document.getElementById("price").value, "ether");
	const price = parseInt(document.getElementById("price").value);

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        await contract.methods.createShipment(receiver, pickupTime, distance, price)
            .send({ from: accounts[0],gas:200000});

        alert("Shipment created successfully!");
        
    } catch (error) {
        console.error("Error creating shipment:", error);
        alert("Error creating shipment. Check console for details.");
    }
}

// Load shipments
async function loadShipments() {
    try {
        const shipments = await contract.methods.getAllShipments().call();
        
        const shipmentList = document.getElementById("shipment-list");
        shipmentList.innerHTML = "";
		console.log(shipments);
		shipments.forEach((shipment, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <p>Shipment ID: ${index}</p>
                <p>Sender: ${shipment.sender}</p>
                <p>Receiver: ${shipment.receiver}</p>
              <p>Pickup Time: ${new Date(Number(shipment.pickupTime) * 1000).toLocaleString()}</p>
                <p>Distance: ${parseInt(shipment.distance)} km</p>
                <p>Price: ${parseInt(shipment.price)} $</p>
                <p>Status: ${getStatus(parseInt(shipment.status))}</p>
                <button id="ship-${index}">Mark as Shipped</button>
                <button id="deliver-${index}">Mark as Delivered</button>
            `;
            shipmentList.appendChild(listItem);

            document.getElementById(`ship-${index}`).addEventListener('click', () => updateShipmentStatus(index, 1));
            document.getElementById(`deliver-${index}`).addEventListener('click', () => updateShipmentStatus(index, 2));
        });
        // shipments.forEach((shipment, index) => {
        //     const listItem = document.createElement("li");
        //     listItem.innerHTML = `
        //         <p>Shipment ID: ${index}</p>
        //         <p>Sender: ${shipment.sender}</p>
        //         <p>Receiver: ${shipment.receiver}</p>
        //         <p>Pickup Time: ${parseInt(shipment.pickupTime)}</p>
        //         <p>Distance: ${parseInt(shipment.distance)} km</p>
        //         <p>Price: ${parseInt(shipment.price)} ETH</p>
        //         <p>Status: ${getStatus(parseInt(shipment.status))}</p>
        //         <button >Mark as Shipped</button>
        //         <button >Mark as Delivered</button>
        //     `;
        //     shipmentList.appendChild(listItem);
        // });
    } catch (error) {
        console.error("Error fetching shipments:", error);
        alert("loading.");
    }
}

// Update shipment status
async function updateShipmentStatus(id, status) {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        await contract.methods.updateShipmentStatus(id, status).send({ from: accounts[0] });

        alert("Shipment status updated!");
        loadShipments();
    } catch (error) {
        console.error("Error updating shipment status:", error);
        alert("Error updating shipment status. Check console for details.");
    }
}

// Get status text
function getStatus(status) {
    switch (status) {
        case 0:
            return "Created";
        case 1:
            return "Shipped";
        case 2:
            return "Delivered";
        default:
            return "Unknown";
    }
}

// Add event listener to connect wallet button
// document.getElementById("connect-wallet-button").addEventListener("click", connectWallet);

// Add event listener to create shipment button
// document.getElementById("create-shipment-button").addEventListener("click", createShipment);
