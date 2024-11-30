> **Please read the Important Notes and Project Technologies Details at the bottom for additional information and setup instructions.**
# Safe Path Navigator  

**Safe Path Navigator** is a React Native mobile application focused on enhancing women's safety during travel. The app leverages real-time crime data to suggest the safest routes between two points, helping users make informed decisions about their journeys.  

## Key Features  

### 1. Route Recommendations  
- Displays multiple routes from origin to destination, color-coded based on safety levels (crime scores).  
- Automatically generates 2-3 route combinations with average crime rates for comparison.  
- Highlights the safest paths using intuitive visual markers.  

### 2. Crime-Based Safety Scoring  
- Uses real road data and crime statistics to calculate a safety score for each road.  
- Offers clear indicators of safer and riskier areas.  

### 3. Interactive Map  
- Google Maps-like interface for seamless navigation.  
- Allows users to set directions using input fields for origin and destination.  
- Displays map updates in real-time for live tracking.  

### 4. User Navigation  
- Start directions for a selected route with turn-by-turn guidance.  
- Offers suggestions for alternate routes if needed.  

### 5. User-Friendly Design  
- Clean and beautiful UI/UX for ease of use.  
- Search and suggestion options for origins and destinations.




---

## Important Notes

### Missing Files
1. **Node Modules**:  
   The `node_modules/` folder has not been uploaded. This folder contains all the dependencies needed for the project. To install them, run the following command after cloning the repository:
   npm install
   or if you're using Yarn:
   yarn install

Safe Path Navigator empowers users to navigate their surroundings safely and confidently, combining real-time data with modern mapping capabilities.

2. **Design Assets**:  
Some design files, such as UI components and additional images, have not been uploaded yet. These will be added in a future update. 

---


## Setup Instructions

Follow these steps to get the project up and running:

1. **Clone the repository**:
Clone this repository to your local machine using the following command:
git clone https://github.com/your-username/safe-path-navigator.git


2. **Install dependencies**:
Navigate to the project folder and install the necessary dependencies:
npm install


3. **Firebase Setup**:
- Create a Firebase project if you haven't already at [Firebase Console](https://console.firebase.google.com/).
- Add Firebase authentication and configure the necessary services (like Google Sign-In).
- Paste your Firebase configuration into the `firebaseConfig.js` file.

4. **Run the app**:
Once the dependencies are installed and Firebase is set up, you can start the app by running:
npm run 


---

## Project Details

### **Technologies Used**:
- **React Native**: Framework for building the mobile app.
- **Firebase**: Backend for user authentication and data storage.
- **HERE API And Others**: For route mapping and navigation.
- **React Navigation**: For managing navigation between screens.
- **Axios**: For API calls (if you need external APIs for crime data or other information).

### **Future Updates**:
- Addition of missing design assets.
- Improved crime data collection and integration.
- Enhanced user interface and experience based on user feedback.
- Additional safety features, including SOS alerts and emergency contacts.

---

