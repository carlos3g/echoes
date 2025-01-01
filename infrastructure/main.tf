# 1. S3 Bucket Configuration
resource "aws_s3_bucket" "avatars" {
  bucket = var.s3_bucket_name
}

resource "aws_s3_bucket_acl" "avatars_acl" {
  bucket = aws_s3_bucket.avatars.id
  acl    = "private"
}

# 2. RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier          = "mydbinstance"
  engine              = "postgres"
  engine_version      = "14.8"
  instance_class      = "db.t3.micro"
  db_name             = var.db_name
  username            = var.db_username
  password            = var.db_password
  allocated_storage   = 20
  multi_az            = true
  storage_type        = "gp3"
  skip_final_snapshot = true

  tags = {
    Name = "MyDatabaseInstance"
  }
}

# 3. Application Load Balancer
resource "aws_lb" "app_lb" {
  name               = "app-load-balancer"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = var.subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = "MyApp-ELB"
  }
}

# 4. EC2 Instances
resource "aws_instance" "app_instance" {
  count         = 2
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.subnet_ids[count.index % length(var.subnet_ids)]

  vpc_security_group_ids = [aws_security_group.app_sg.id]
  key_name               = var.key_name

  associate_public_ip_address = true

  tags = {
    Name = "NodeJSAppInstance-${count.index + 1}"
  }

  # TODO: finish this
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nodejs npm git
              cd /home/ubuntu
              EOF
}

# 5. CloudFront Distribution
resource "aws_cloudfront_distribution" "avatars_distribution" {
  origin {
    domain_name = aws_s3_bucket.avatars.bucket_regional_domain_name
    origin_id   = "S3-Avatars"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.avatars_oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Avatars"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  # aliases = ["avatars.carlos3g.dev"]

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Name = "AvatarsCloudFront"
  }
}

# 6. CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "avatars_oai" {
  comment = "OAI for avatars S3 bucket"
}

# 7. S3 Bucket Policy for CloudFront
resource "aws_s3_bucket_policy" "avatars" {
  bucket = aws_s3_bucket.avatars.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontAccess"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.avatars_oai.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.avatars.arn}/*"
      }
    ]
  })
}

# 8. Security Group for Load Balancer
resource "aws_security_group" "lb_sg" {
  name        = "lb-security-group"
  description = "Security group for load balancer"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "LoadBalancer-SG"
  }
}

# 9. Security Group for EC2 Instances
resource "aws_security_group" "app_sg" {
  name        = "app-security-group"
  description = "Security group for application instances"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.lb_sg.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Application-SG"
  }
}
