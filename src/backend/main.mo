import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Int "mo:core/Int";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module StartupNode {
    public func compare(node1 : StartupNode, node2 : StartupNode) : Order.Order {
      Text.compare(node1.id, node2.id);
    };
  };

  type StartupNode = {
    id : Text;
    ownerId : Principal;
    companyName : Text;
    description : Text;
    sector : Text;
    city : Text;
    latitude : Float;
    longitude : Float;
    directive : Text;
    createdAt : Time.Time;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.userId.toText(), profile2.userId.toText());
    };
  };

  type UserProfile = {
    userId : Principal;
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    sector : Text;
    startupName : Text;
    bio : Text;
    updatedAt : Time.Time;
  };

  // Data Stores
  var nextNodeId = 1;
  let nodes = Map.empty<Text, StartupNode>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Generate Unique Node ID
  func generateNodeId() : Text {
    let id = nextNodeId;
    nextNodeId += 1;
    id.toText();
  };

  // StartupNode Operations
  public shared ({ caller }) func createNode(
    companyName : Text,
    description : Text,
    sector : Text,
    city : Text,
    latitude : Float,
    longitude : Float,
    directive : Text
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create nodes");
    };

    if (companyName == "" or description == "" or sector == "" or city == "") {
      return "Error: Missing required fields";
    };

    let newNode : StartupNode = {
      id = generateNodeId();
      ownerId = caller;
      companyName;
      description;
      sector;
      city;
      latitude;
      longitude;
      directive;
      createdAt = Time.now();
    };

    nodes.add(newNode.id, newNode);
    newNode.id;
  };

  public query ({ caller }) func getAllNodes() : async [StartupNode] {
    nodes.values().toArray().sort();
  };

  public query ({ caller }) func getMyNode() : async ?StartupNode {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their own node");
    };

    switch (nodes.values().find(func(node) { node.ownerId == caller })) {
      case (null) { null };
      case (?found) { ?found };
    };
  };

  public shared ({ caller }) func updateNode(
    id : Text,
    companyName : Text,
    description : Text,
    sector : Text,
    city : Text,
    latitude : Float,
    longitude : Float,
    directive : Text
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update nodes");
    };

    switch (nodes.get(id)) {
      case (null) { "Error: Node not found" };
      case (?node) {
        if (node.ownerId != caller) {
          Runtime.trap("Unauthorized: Only the owner can update this node");
        };
        let updatedNode : StartupNode = {
          id = node.id;
          ownerId = node.ownerId;
          companyName;
          description;
          sector;
          city;
          latitude;
          longitude;
          directive;
          createdAt = node.createdAt;
        };
        nodes.add(id, updatedNode);
        "Node updated successfully";
      };
    };
  };

  public shared ({ caller }) func deleteNode(id : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete nodes");
    };

    switch (nodes.get(id)) {
      case (null) { "Error: Node not found" };
      case (?node) {
        if (node.ownerId != caller) {
          Runtime.trap("Unauthorized: Only the owner can delete this node");
        };
        nodes.remove(id);
        "Node deleted successfully";
      };
    };
  };

  // UserProfile Operations
  public shared ({ caller }) func upsertProfile(
    name : Text,
    email : Text,
    phone : Text,
    city : Text,
    sector : Text,
    startupName : Text,
    bio : Text
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    if (name == "" or email == "") {
      return "Error: Name and email are required";
    };

    let newProfile : UserProfile = {
      userId = caller;
      name;
      email;
      phone;
      city;
      sector;
      startupName;
      bio;
      updatedAt = Time.now();
    };

    userProfiles.add(caller, newProfile);
    "Profile saved successfully";
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their own profile");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getProfileByUserId(userId : Principal) : async ?UserProfile {
    userProfiles.get(userId);
  };

  // Required frontend functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their own profile");
    };

    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  // Seed Data
  public shared ({ caller }) func seedData() : async Text {
    // Ensure only admin can seed data
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };

    let sampleNodes : [StartupNode] = [
      // Mumbai - Fintech
      {
        id = "1";
        ownerId = caller;
        companyName = "Mumbai Fintech Solutions";
        description = "Leading fintech innovation in Mumbai.";
        sector = "Fintech";
        city = "Mumbai";
        latitude = 19.0760;
        longitude = 72.8777;
        directive = "Looking for Investors";
        createdAt = Time.now();
      },
      // Bangalore - AI/ML
      {
        id = "2";
        ownerId = caller;
        companyName = "Bangalore AI/ML Hub";
        description = "AI and ML startup hub in Bangalore.";
        sector = "AI/ML";
        city = "Bangalore";
        latitude = 12.9716;
        longitude = 77.5946;
        directive = "Looking for Developers";
        createdAt = Time.now();
      },
      // Delhi - SaaS
      {
        id = "3";
        ownerId = caller;
        companyName = "Delhi SaaS Innovators";
        description = "SaaS product development in Delhi.";
        sector = "SaaS";
        city = "Delhi";
        latitude = 28.6139;
        longitude = 77.2090;
        directive = "Open to All";
        createdAt = Time.now();
      },
      // Hyderabad - Edtech
      {
        id = "4";
        ownerId = caller;
        companyName = "Hyderabad Edtech Leaders";
        description = "Edtech advancements in Hyderabad.";
        sector = "Edtech";
        city = "Hyderabad";
        latitude = 17.3850;
        longitude = 78.4867;
        directive = "Looking for Collaborators";
        createdAt = Time.now();
      },
      // Chennai - Healthtech
      {
        id = "5";
        ownerId = caller;
        companyName = "Chennai Healthtech Pioneers";
        description = "Healthtech solutions in Chennai.";
        sector = "Healthtech";
        city = "Chennai";
        latitude = 13.0827;
        longitude = 80.2707;
        directive = "Looking for Co-Founders";
        createdAt = Time.now();
      },
      // Pune - CleanTech
      {
        id = "6";
        ownerId = caller;
        companyName = "Pune CleanTech";
        description = "CleanTech innovations in Pune.";
        sector = "CleanTech";
        city = "Pune";
        latitude = 18.5204;
        longitude = 73.8567;
        directive = "Looking for Investors";
        createdAt = Time.now();
      },
      // Kolkata - E-commerce
      {
        id = "7";
        ownerId = caller;
        companyName = "Kolkata E-commerce";
        description = "E-commerce advancements in Kolkata.";
        sector = "E-commerce";
        city = "Kolkata";
        latitude = 22.5726;
        longitude = 88.3639;
        directive = "Looking for Developers";
        createdAt = Time.now();
      },
      // Ahmedabad - Agritech
      {
        id = "8";
        ownerId = caller;
        companyName = "Ahmedabad Agritech";
        description = "Agritech solutions in Ahmedabad.";
        sector = "Agritech";
        city = "Ahmedabad";
        latitude = 23.0225;
        longitude = 72.5714;
        directive = "Open to All";
        createdAt = Time.now();
      },
    ];

    for (node in sampleNodes.values()) {
      nodes.add(node.id, node);
    };

    "Data seeded successfully";
  };
};
