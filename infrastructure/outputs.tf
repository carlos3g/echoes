output "load_balancer_dns_name" {
  description = "DNS of the Load Balancer"
  value       = aws_lb.app_lb.dns_name
}

output "s3_bucket_url" {
  description = "URL of the S3 Bucket"
  value       = aws_s3_bucket.avatars.bucket_regional_domain_name
}

output "cloudfront_domain_name" {
  description = "Domain of the CloudFront"
  value       = aws_cloudfront_distribution.avatars_distribution.domain_name
}
