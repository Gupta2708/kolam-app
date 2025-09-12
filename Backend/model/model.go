
package model

import "time"

type Image struct {
    ID        interface{} `bson:"_id,omitempty" json:"id"`
    Filename  string      `bson:"filename" json:"filename"`
    URL       string      `bson:"url" json:"url"`
    Width     int         `bson:"width,omitempty" json:"width,omitempty"`
    Height    int         `bson:"height,omitempty" json:"height,omitempty"`
    CreatedAt time.Time   `bson:"created_at" json:"created_at"`
}