package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoClient *mongo.Client
	ImagesColl  *mongo.Collection

	// Cloudinary config (read from env)
	CloudinaryURL       string
	CloudinaryCloudName string
	CloudinaryAPIKey    string
	CloudinaryAPISecret string
)

// InitMongo connects to MongoDB and initializes the images collection.
// Environment variables supported:
// - MONGODB_URI or MONGO_URI (required)
// - MONGODB_DATABASE or DB_NAME (optional, default "kolam")
func InitMongo() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = os.Getenv("MONGO_URI")
	}
	if mongoURI == "" {
		return fmt.Errorf("MONGODB_URI (or MONGO_URI) environment variable is not set")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return fmt.Errorf("mongo connect: %w", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return fmt.Errorf("mongo ping: %w", err)
	}

	dbName := os.Getenv("MONGODB_DATABASE")
	if dbName == "" {
		dbName = os.Getenv("DB_NAME")
	}
	if dbName == "" {
		dbName = "kolam"
	}

	MongoClient = client
	ImagesColl = client.Database(dbName).Collection("images")

	// Log connection success without showing the URI
	log.Printf("Connected to MongoDB database: %s", dbName)
	return nil
}

// InitCloudinaryConfig loads Cloudinary configuration from environment.
// Preferred: CLOUDINARY_URL (cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
// Fallback to individual vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
func InitCloudinaryConfig() {
	CloudinaryURL = os.Getenv("CLOUDINARY_URL")
	CloudinaryCloudName = os.Getenv("CLOUDINARY_CLOUD_NAME")
	CloudinaryAPIKey = os.Getenv("CLOUDINARY_API_KEY")
	CloudinaryAPISecret = os.Getenv("CLOUDINARY_API_SECRET")

	// If CLOUDINARY_URL is not set but individual parts are present, build a fallback URL for convenience
	if CloudinaryURL == "" && CloudinaryCloudName != "" && CloudinaryAPIKey != "" && CloudinaryAPISecret != "" {
		CloudinaryURL = fmt.Sprintf("cloudinary://%s:%s@%s", CloudinaryAPIKey, CloudinaryAPISecret, CloudinaryCloudName)
	}

	if CloudinaryURL != "" {
		log.Println("Cloudinary config loaded from CLOUDINARY_URL")
	} else if CloudinaryCloudName != "" {
		log.Printf("Cloudinary config loaded from individual vars (cloud name: %s)", CloudinaryCloudName)
	} else {
		log.Println("Cloudinary config not set; Cloudinary uploads will fail until configured")
	}
}

// CloseMongo cleanly disconnects the Mongo client.
func CloseMongo() {
	if MongoClient == nil {
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = MongoClient.Disconnect(ctx)
	log.Println("Disconnected from MongoDB")
}
