package service

import (
	"context"
	"fmt"
	"time"

	"github.com/ansh0014/KolamApp/config"
	"github.com/ansh0014/KolamApp/model"

	"go.mongodb.org/mongo-driver/mongo"
)

// SaveImageMeta inserts image metadata into MongoDB and returns the inserted ID.
func SaveImageMeta(img *model.Image) (interface{}, error) {
	// ensure collection is initialized
	if config.ImagesColl == nil {
		return nil, fmt.Errorf("images collection is not initialized")
	}

	img.CreatedAt = time.Now().UTC()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := config.ImagesColl.InsertOne(ctx, img)
	if err != nil {
		// if it's a mongo error, return it directly
		if err == mongo.ErrNilDocument {
			return nil, fmt.Errorf("invalid image document: %w", err)
		}
		return nil, err
	}

	return res.InsertedID, nil
}
