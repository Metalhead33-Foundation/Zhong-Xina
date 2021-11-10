variable "bot_image" {
  type = string
}

variable "bot_version" {
  type = string
}

variable "namespace" {
  type = string
}

variable "gitlab_app" {
  type = string
}

variable "environment" {
  type = string
}

locals {
  labels = {
    application = "Zhong-Xina"
    customer = "Metalhead33"
  }
  annotations = {
    "app.gitlab.com/app" = var.gitlab_app
    "app.gitlab.com/env" = var.environment
  }
  name = "${var.environment}-zhong-xina"
}

resource "kubernetes_namespace" "zhong_xina" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_service_account" "zhong_xina" {
  metadata {
    name = local.name
    namespace = kubernetes_namespace.zhong_xina.metadata[0].name
    labels = local.labels
  }
}

resource "kubernetes_deployment" "zhong_xina" {
  metadata {
    name = local.name
    namespace = kubernetes_namespace.zhong_xina.metadata[0].name
    labels = merge(local.labels, {
      component = "bot"
    })
    annotations = local.annotations
  }
  spec {
    revision_history_limit = 1
    selector {
      match_labels = merge(local.labels, {
        component = "bot"
      })
    }
    template {
      metadata {
        labels = merge(local.labels, {
          component = "bot"
          version = var.bot_version
        })
      }
      spec {
        container {
          name = "main"
          image = "${var.bot_image}:${var.bot_version}"
          volume_mount {
            mount_path = "/config"
            name       = "config"
          }
          env {
            name = "AUTHLOC"
            value = "/config/auth.json"
          }
        }

        volume {
          name = "config"
          secret {
            optional = false
            secret_name = "auth"
          }
        }
        service_account_name = kubernetes_service_account.zhong_xina.metadata[0].name
        automount_service_account_token = true
      }
    }
  }
}