// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract SupplyChain {
    // enum Status { Created, Shipped, Delivered }

    struct Shipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 distance;
        uint256 price;
        uint256 status;
    }

    Shipment[] public shipments;

    event ShipmentCreated(uint256 shipmentId, address indexed sender, address indexed receiver, uint256 price);
    event ShipmentStatusUpdated(uint256 shipmentId, uint256 status);

    function createShipment(address _receiver, uint256 _pickupTime, uint256 _distance, uint256 _price) public  {
        // require(msg.value == _price, "Price must be paid");

        shipments.push(Shipment({
            sender: msg.sender,
            receiver: _receiver,
            pickupTime: _pickupTime,
            distance: _distance,
            price: _price,
            status: 0
        }));

        // emit ShipmentCreated(shipments.length - 1, msg.sender, _receiver, _price);
    }

    function getAllShipments() external view returns (Shipment[] memory) {
        return shipments;
    }

    function updateShipmentStatus(uint256 _shipmentId, uint _status) external {
        // Shipment storage shipment = 
        shipments[_shipmentId].status=_status;

        // require(msg.sender == shipment.sender, "Only sender can update the status");

        // shipment.status = _status;
        // emit ShipmentStatusUpdated(_shipmentId, _status);
    }
    function forDev()public {
        createShipment(0x4Dbeb25614FAd2FB88E6D359e767F8Ba1AcC4f32,1,2,1);
        createShipment( 0x1a9C825fb80851B66D9A646de5f05294A53F8F33,98,67,4);
        createShipment(0x4Dbeb25614FAd2FB88E6D359e767F8Ba1AcC4f32,187,287,4);
    }
}