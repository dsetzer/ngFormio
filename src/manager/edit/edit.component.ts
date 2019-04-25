import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormManagerService } from '../form-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormManagerConfig } from '../form-manager.config';
import { FormioAlerts } from '../../components/alerts/formio.alerts';
import { FormBuilderComponent } from '../../components/formbuilder/formbuilder.component';
import _ from 'lodash';

@Component({
  templateUrl: './edit.component.html'
})
export class FormManagerEditComponent implements AfterViewInit {
  @ViewChild(FormBuilderComponent) builder: FormBuilderComponent;
  @ViewChild('title') formTitle: ElementRef;
  @ViewChild('type') formType: ElementRef;
  public builderReady: Promise<any>;
  public form: any;
  public loading: Boolean;
  public formReady: Boolean;
  public editMode: Boolean;

  constructor(
    public service: FormManagerService,
    public router: Router,
    public route: ActivatedRoute,
    public config: FormManagerConfig,
    public ref: ChangeDetectorRef,
    public alerts: FormioAlerts
  ) {
    this.form = {components: []};
    this.formReady = false;
    this.loading = false;
    this.editMode = false;
  }

  checkBuilder(cb) {
    if (this.builder) {
      return cb(this.builder);
    }
    setTimeout(() => this.checkBuilder(cb), 100);
  }

  ngAfterViewInit() {
    this.builderReady = new Promise((resolve) => this.checkBuilder(resolve));
    this.route.url.subscribe( url => {
      // See if we are editing a form or creating one.
      if (url[0].path === 'edit') {
        this.loading = true;
        this.ref.detectChanges();
        this.editMode = true;
        this.service.loadForm().then(form => {
          this.form = form;
          this.ref.detectChanges();
          this.formTitle.nativeElement.value = form.title;
          this.formType.nativeElement.value = form.display || 'form';
          this.formReady = true;
          this.builderReady.then(() => {
            this.builder.buildForm(form);
            this.loading = false;
          });
        }).catch(err => {
          this.alerts.setAlert({type: 'danger', message: (err.message || err)});
          this.loading = false;
          this.formReady = true;
        });
      } else {
        this.formReady = true;
      }

      this.formType.nativeElement.addEventListener('change', () => {
        this.builderReady.then(() => this.builder.setDisplay(this.formType.nativeElement.value));
      });
    });
  }

  saveForm() {
    this.loading = true;
    return this.builderReady.then(() => {
      this.form.title = this.formTitle.nativeElement.value;
      this.form.display = this.formType.nativeElement.value;
      this.form.components = this.builder.formio.schema.components;
      if (this.config.tag) {
        this.form.tags = this.form.tags || [];
        this.form.tags.push(this.config.tag);
        this.form.tags = _.uniq(this.form.tags);
      }
      if (!this.form._id) {
        this.form.name = _.camelCase(this.form.title).toLowerCase();
        this.form.path = this.form.name;
      }
      return this.service.formio.saveForm(this.form).then(form => {
        this.form = this.service.setForm(form);
        this.loading = false;
        return this.form;
      }).catch(err => {
        this.loading = false;
        // Catch if a form is returned as an error. This is a conflict.
        if (err._id && err.type) {
          throw err;
        }
        this.alerts.setAlert({type: 'danger', message: (err.message || err)});
      });
    });
  }

  onSave() {
    return this.saveForm().then((form) => {
      if (this.editMode) {
        this.router.navigate(['../', 'view'], {relativeTo: this.route});
      } else {
        this.router.navigate(['../', form._id, 'view'], {relativeTo: this.route});
      }
    });
  }
}